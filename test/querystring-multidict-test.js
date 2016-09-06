// Load in dependencies
var assert = require('assert');
var qsMultiDict = require('../');
var MultiDictKeyError = require('../').MultiDictKeyError;

// Start our tests
describe('A querystring-multidict instance', function () {
  it('can retrieve a key\'s first value', function () {
    var multidict = qsMultiDict.parse('a=b&a=c');
    assert.strictEqual(multidict.get('a'), 'b');
  });

  it('can retrieve a key with a default value', function () {
    var multidict = qsMultiDict.parse('a=b&a=c');
    assert.strictEqual(multidict.get('d', 4), 4);
  });

  it('can retrieve all values from a key', function () {
    var multidict = qsMultiDict.parse('a=b&a=c');
    assert.deepEqual(multidict.getArray('a'), ['b', 'c']);
  });

  it('can fetch a key\'s first value', function () {
    var multidict = qsMultiDict.parse('a=b&a=c');
    assert.strictEqual(multidict.fetch('a'), 'b');
  });

  it('can throw when fetching from a non-existent key', function () {
    var multidict = qsMultiDict.parse('a=b&a=c');
    var err;
    try {
      multidict.fetch('d');
    } catch (_err) {
      err = _err;
    }

    // Verify we threw as expected
    assert(err);

    // Verify developer helper attributes (e.g. `instanceof`, `key`)
    assert(err instanceof MultiDictKeyError);
    assert.strictEqual(err.key, 'd');
  });
});

// Edge cases
describe('A querystring-multidict instance', function () {
  it('retrieving an undefined key via `get` receives `undefined`', function () {
    var multidict = qsMultiDict.parse('');
    assert.strictEqual(multidict.get('a'), undefined);
  });

  it('retrieving an undefined key via `getArray` receives an empty array', function () {
    var multidict = qsMultiDict.parse('');
    assert.deepEqual(multidict.getArray('a'), []);
  });
});
