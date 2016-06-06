// Query String Utilities
// Based on https://github.com/nodejs/node/blob/v6.2.1/lib/querystring.js

const Buffer = require('buffer').Buffer;
const qsUnescape = require('querystring').unescape;

// This constructor is used to store parsed query string values. Instantiating
// this is faster than explicitly calling `Object.create(null)` to get a
// "clean" empty object (tested with v8 v4.9).
function ParsedQueryString() {}
ParsedQueryString.prototype = Object.create(null);

// Parse a key/val string.
exports.parse = exports.decode = function (qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';

  const obj = new ParsedQueryString();

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  if (typeof sep !== 'string') {
    sep += '';
  }

  const eqLen = eq.length;
  const sepLen = sep.length;

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var pairs = Infinity;
  if (maxKeys > 0) {
    pairs = maxKeys;
  }

  var decode = qsUnescape;
  if (options && typeof options.decodeURIComponent === 'function') {
    decode = options.decodeURIComponent;
  }
  const customDecode = (decode !== qsUnescape);

  const keys = [];
  var lastPos = 0;
  var sepIdx = 0;
  var eqIdx = 0;
  var key = '';
  var value = '';
  var keyEncoded = customDecode;
  var valEncoded = customDecode;
  var encodeCheck = 0;
  for (var i = 0; i < qs.length; ++i) {
    const code = qs.charCodeAt(i);

    // Try matching key/value pair separator (e.g. '&')
    if (code === sep.charCodeAt(sepIdx)) {
      if (++sepIdx === sepLen) {
        // Key/value pair separator match!
        const end = i - sepIdx + 1;
        if (eqIdx < eqLen) {
          // If we didn't find the key/value separator, treat the substring as
          // part of the key instead of the value
          if (lastPos < end) {
            key += qs.slice(lastPos, end);
          }
        } else if (lastPos < end) {
          value += qs.slice(lastPos, end);
        }
        if (keyEncoded) {
          key = decodeStr(key, decode);
        }
        if (valEncoded) {
          value = decodeStr(value, decode);
        }
        // Use a key array lookup instead of using hasOwnProperty(), which is
        // slower
        if (keys.indexOf(key) === -1) {
          obj[key] = value;
          keys[keys.length] = key;
        } else {
          const curValue = obj[key];
          // `instanceof Array` is used instead of Array.isArray() because it
          // is ~15-20% faster with v8 4.7 and is safe to use because we are
          // using it with values being created within this function
          if (curValue instanceof Array) {
            curValue[curValue.length] = value;
          } else {
            obj[key] = [curValue, value];
          }
        }
        if (--pairs === 0) {
          break;
        }
        keyEncoded = valEncoded = customDecode;
        encodeCheck = 0;
        key = value = '';
        lastPos = i + 1;
        sepIdx = eqIdx = 0;
      }
      continue;
    } else {
      sepIdx = 0;
      if (!valEncoded) {
        // Try to match an (valid) encoded byte (once) to minimize unnecessary
        // calls to string decoding functions
        if (code === 37/*%*/) {
          encodeCheck = 1;
        } else if (encodeCheck > 0 &&
                   ((code >= 48/*0*/ && code <= 57/*9*/) ||
                    (code >= 65/*A*/ && code <= 70/*F*/) ||
                    (code >= 97/*a*/ && code <= 102/*f*/))) {
          if (++encodeCheck === 3) {
            valEncoded = true;
          }
        } else {
          encodeCheck = 0;
        }
      }
    }

    // Try matching key/value separator (e.g. '=') if we haven't already
    if (eqIdx < eqLen) {
      if (code === eq.charCodeAt(eqIdx)) {
        if (++eqIdx === eqLen) {
          // Key/value separator match!
          const end = i - eqIdx + 1;
          if (lastPos < end) {
            key += qs.slice(lastPos, end);
          }
          encodeCheck = 0;
          lastPos = i + 1;
        }
        continue;
      } else {
        eqIdx = 0;
        if (!keyEncoded) {
          // Try to match an (valid) encoded byte once to minimize unnecessary
          // calls to string decoding functions
          if (code === 37/*%*/) {
            encodeCheck = 1;
          } else if (encodeCheck > 0 &&
                     ((code >= 48/*0*/ && code <= 57/*9*/) ||
                      (code >= 65/*A*/ && code <= 70/*F*/) ||
                      (code >= 97/*a*/ && code <= 102/*f*/))) {
            if (++encodeCheck === 3) {
              keyEncoded = true;
            }
          } else {
            encodeCheck = 0;
          }
        }
      }
    }

    if (code === 43/*+*/) {
      if (eqIdx < eqLen) {
        if (i - lastPos > 0) {
          key += qs.slice(lastPos, i);
        }
        key += '%20';
        keyEncoded = true;
      } else {
        if (i - lastPos > 0) {
          value += qs.slice(lastPos, i);
        }
        value += '%20';
        valEncoded = true;
      }
      lastPos = i + 1;
    }
  }

  // Check if we have leftover key or value data
  if (pairs > 0 && (lastPos < qs.length || eqIdx > 0)) {
    if (lastPos < qs.length) {
      if (eqIdx < eqLen) {
        key += qs.slice(lastPos);
      } else if (sepIdx < sepLen) {
        value += qs.slice(lastPos);
      }
    }
    if (keyEncoded) {
      key = decodeStr(key, decode);
    }
    if (valEncoded) {
      value = decodeStr(value, decode);
    }
    // Use a key array lookup instead of using hasOwnProperty(), which is
    // slower
    if (keys.indexOf(key) === -1) {
      obj[key] = value;
      keys[keys.length] = key;
    } else {
      const curValue = obj[key];
      // `instanceof Array` is used instead of Array.isArray() because it
      // is ~15-20% faster with v8 4.7 and is safe to use because we are
      // using it with values being created within this function
      if (curValue instanceof Array) {
        curValue[curValue.length] = value;
      } else {
        obj[key] = [curValue, value];
      }
    }
  }

  return obj;
};

// v8 does not optimize functions with try-catch blocks, so we isolate them here
// to minimize the damage
function decodeStr(s, decoder) {
  try {
    return decoder(s);
  } catch (e) {
    return QueryString.unescape(s, true);
  }
}
