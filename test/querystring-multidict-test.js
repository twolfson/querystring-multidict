// Load in dependencies
var assert = require('assert');
var qs = require('../');

// Start our tests
describe('A querystring-multidict instance', function () {
  it('can retrieve a key\'s first value', function () {
    var multidict = qs.parse('a=b&a=c');
    assert.strictEqual(multidict.get('a'), 'b');
  });

  it('can retrieve a key with a default value', function () {
    var multidict = qs.parse('a=b&a=c');
    assert.strictEqual(multidict.get('d', 4), 4);
  });

  it('can retrieve all values from a key', function () {
    var multidict = qs.parse('a=b&a=c');
    assert.deepEqual(multidict.getArray('a'), ['b', 'c']);
  });
});

// Edge cases
describe('A querystring-multidict instance', function () {
  it('retrieving an undefined key via `get` receives `undefined`', function () {
    var multidict = qs.parse('');
    assert.strictEqual(multidict.get('a'), undefined);
  });

  it('retrieving an undefined key via `getArray` receives an empty array', function () {
    var multidict = qs.parse('');
    assert.deepEqual(multidict.getArray('a'), []);
  });
});
