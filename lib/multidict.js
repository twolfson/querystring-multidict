// Based on https://github.com/pallets/werkzeug/blob/0.11.10/werkzeug/datastructures.py#L267-L643
// Load in our dependencies
var AssertionError = require('assert').AssertionError;
var util = require('util');

// Define custom KeyError
// Based on https://github.com/nodejs/node/blob/v6.5.0/lib/assert.js#L39-L71
function MultiDictKeyError(key) {
  // Initially process `MultiDictKeyError` as an `AssertionError`
  // https://github.com/nodejs/node/blob/v6.5.0/lib/assert.js#L84-L106
  AssertionError.call(this, {
    message: 'MultiDictKeyError: Key not found "' + key + '"',
    actual: false,
    expected: true,
    operator: '==',
    stackStartFunction: MultiDictKeyError
  });

  // Overload `AssertionError` properties with customizations
  this.name = 'MultiDictKeyError';
  this.key = key;
}
util.inherits(MultiDictKeyError, AssertionError);

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function MultiDict() {
  // Save items for later
  this.items = {};
}
MultiDict.prototype = {
  get: function (key, defaultVal) {
    // If we have the key, return the first value
    if (hasOwnProperty(this.items, key)) {
      return this.items[key][0];
    // Otherwise, return our default value
    // DEV: When `defaultVal` isn't passed, we will receive `undefined`
    //   as expected from an empty object/array
    } else {
      return defaultVal;
    }
  },
  getArray: function (key) {
    // If our key is defined, return its array
    if (hasOwnProperty(this.items, key)) {
      return this.items[key];
    // Otherwise, return an empty array
    } else {
      return [];
    }
  },
  fetch: function (key) {
    // If we have the key, return the first value
    if (hasOwnProperty(this.items, key)) {
      return this.items[key][0];
    // Otherwise, raise an assertion error
    } else {
      throw new MultiDictKeyError(key);
    }
  },
  add: function (key, val) {
    // Fallback items and add our value
    this.items[key] = hasOwnProperty(this.items, key) ? this.items[key] : [];
    this.items[key].push(val);
  },
  toObject: function () {
    return this.items;
  }
};

// Export our errors as attributes of our constructor
MultiDict.MultiDictKeyError = MultiDictKeyError;

// Export our MultiDict constructor
module.exports = MultiDict;
