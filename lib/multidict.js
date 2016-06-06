// Based on https://github.com/pallets/werkzeug/blob/0.11.10/werkzeug/datastructures.py#L267-L643
function MultiDict() {
  // Save items for later
  this.items = {};
}
MultiDict.prototype = {
  get: function (key, defaultVal) {
    // If we have the key, return the first value
    // TODO: Verify no issues with `hasOwnProperty`
    if (this.items[key]) {
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
    // TODO: Verify no issues with `hasOwnProperty`
    if (this.items[key]) {
      return this.items[key];
    // Otherwise, return an empty array
    } else {
      return [];
    }
  },
  add: function (key, val) {
    // Fallback items and add our value
    // TODO: Verify no issues with `hasOwnProperty`
    this.items[key] = this.items[key] || [];
    this.items[key].push(val);
  }
};

// Export our MultiDict constructor
module.exports = MultiDict;
