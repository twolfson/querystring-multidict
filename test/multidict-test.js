// Load in dependencies
var assert = require('assert');
var MultiDict = require('../lib/multidict');

// Start our tests
describe('A multidict instance', function () {
  it('initially has no values', function () {
    var multidict = new MultiDict();
    assert.deepEqual(multidict.toObject(), {});
  });

  describe('with a value added', function () {
    it('has stored the value under its key', function () {
      var multidict = new MultiDict();
      multidict.add('a', 'b');
      assert.deepEqual(multidict.toObject(), {a: ['b']});
    });
  });

  describe('with a value added under a tricky key', function () {
    before(function createTrickyMultiDict () {
      this.multidict = new MultiDict();
      this.multidict.add('hasOwnProperty', 1);
    });
    after(function cleanup () {
      delete this.multidict;
    });

    it('has stored the value under its key', function () {
      // jshint ignore:start
      assert.deepEqual(this.multidict.toObject(), {'hasOwnProperty': [1]});
      // jshint ignore:end
    });

    it('accessed via `get` has no issues', function () {
      assert.deepEqual(this.multidict.get('hasOwnProperty'), 1);
    });

    it('accessed via `getArray` has no issues', function () {
      assert.deepEqual(this.multidict.getArray('hasOwnProperty'), [1]);
    });
  });
});
