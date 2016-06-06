// Load in dependencies
var assert = require('assert');
var querystringMultidict = require('../');

// Start our tests
describe('querystring-multidict', function () {
  it('returns awesome', function () {
    assert.strictEqual(querystringMultidict(), 'awesome');
  });
});
