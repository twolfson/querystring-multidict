// Based on https://github.com/pallets/werkzeug/blob/0.11.10/werkzeug/datastructures.py#L267-L643

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

// TODO: Explicitly test `hasOwnProperty` usage

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
    // TODO: Should we have a custom error subclass with key property
    } else {
      throw new AssertionError('MultiDictError: Key not found "' + key + '"');
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

// Export our MultiDict constructor
module.exports = MultiDict;
