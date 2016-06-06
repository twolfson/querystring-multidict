// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// Tests extracted from Node.js repo
// https://github.com/nodejs/node/blob/v0.10.45/test/simple/test-querystring.js
// jshint ignore:start
// jscs:disable
var assert = require('assert');

// test using assert
var qs = require('../');

describe('Original tests from Node.js', function () {
  it('pass as expected', function () {
    // [ wonkyQS, canonicalQS, obj ]
    var qsTestCases = [
      ['foo=918854443121279438895193',
       'foo=918854443121279438895193',
       {'foo': ['918854443121279438895193']}],
      ['foo=bar', 'foo=bar', {'foo': ['bar']}],
      ['foo=bar&foo=quux', 'foo=bar&foo=quux', {'foo': ['bar', 'quux']}],
      ['foo=1&bar=2', 'foo=1&bar=2', {'foo': ['1'], 'bar': ['2']}],
      ['my+weird+field=q1%212%22%27w%245%267%2Fz8%29%3F',
       'my%20weird%20field=q1!2%22\'w%245%267%2Fz8)%3F',
       {'my weird field': ['q1!2"\'w$5&7/z8)?'] }],
      ['foo%3Dbaz=bar', 'foo%3Dbaz=bar', {'foo=baz': ['bar']}],
      ['foo=baz=bar', 'foo=baz%3Dbar', {'foo': ['baz=bar']}],
      ['str=foo&arr=1&arr=2&arr=3&somenull=&undef=',
       'str=foo&arr=1&arr=2&arr=3&somenull=&undef=',
       { 'str': ['foo'],
         'arr': ['1', '2', '3'],
         'somenull': [''],
         'undef': ['']}],
      [' foo = bar ', '%20foo%20=%20bar%20', {' foo ': [' bar ']}],
      ['foo=%zx', 'foo=%25zx', {'foo': ['%zx']}],
      ['foo=%EF%BF%BD', 'foo=%EF%BF%BD', {'foo': ['\ufffd'] }],
      // See: https://github.com/joyent/node/issues/1707
      ['hasOwnProperty=x&toString=foo&valueOf=bar&__defineGetter__=baz',
        'hasOwnProperty=x&toString=foo&valueOf=bar&__defineGetter__=baz',
        { hasOwnProperty: ['x'],
          toString: ['foo'],
          valueOf: ['bar'],
          __defineGetter__: ['baz'] }],
      // See: https://github.com/joyent/node/issues/3058
      ['foo&bar=baz', 'foo=&bar=baz', { foo: [''], bar: ['baz'] }]
    ];

    var qsColonTestCases = [
      ['foo:bar', 'foo:bar', {'foo': ['bar']}],
      ['foo:bar;foo:quux', 'foo:bar;foo:quux', {'foo': ['bar', 'quux']}],
      ['foo:1&bar:2;baz:quux',
       'foo:1%26bar%3A2;baz:quux',
       {'foo': ['1&bar:2'], 'baz': ['quux']}],
      ['foo%3Abaz:bar', 'foo%3Abaz:bar', {'foo:baz': ['bar']}],
      ['foo:baz:bar', 'foo:baz%3Abar', {'foo': ['baz:bar']}]
    ];

    var extendedFunction = function() {};
    extendedFunction.prototype = {a: 'b'};
    var qsWeirdObjects = [
      [{regexp: /./g}, 'regexp=', {'regexp': ['']}],
      [{regexp: new RegExp('.', 'g')}, 'regexp=', {'regexp': ['']}],
      [{fn: function() {}}, 'fn=', {'fn': ['']}],
      [{fn: new Function('')}, 'fn=', {'fn': ['']}],
      [{math: Math}, 'math=', {'math': ['']}],
      [{e: extendedFunction}, 'e=', {'e': ['']}],
      [{d: new Date()}, 'd=', {'d': ['']}],
      [{d: Date}, 'd=', {'d': ['']}],
      [{f: new Boolean(false), t: new Boolean(true)}, 'f=&t=', {'f': [''], 't': ['']}],
      [{f: false, t: true}, 'f=false&t=true', {'f': ['false'], 't': ['true']}],
      [{n: null}, 'n=', {'n': ['']}],
      [{nan: NaN}, 'nan=', {'nan': ['']}],
      [{inf: Infinity}, 'inf=', {'inf': ['']}]
    ];

    // test that the canonical qs is parsed properly.
    qsTestCases.forEach(function(testCase) {
      assert.deepEqual(testCase[2], qs.parse(testCase[0]).toObject());
    });

    // test that the colon test cases can do the same
    qsColonTestCases.forEach(function(testCase) {
      assert.deepEqual(testCase[2], qs.parse(testCase[0], ';', ':').toObject());
    });

    // test the weird objects, that they get parsed properly
    qsWeirdObjects.forEach(function(testCase) {
      assert.deepEqual(testCase[2], qs.parse(testCase[1]).toObject());
    });

    // test the nested qs-in-qs case
    (function() {
      var f = qs.parse('a=b&q=x%3Dy%26y%3Dz').toObject();
      f.q = f.q.map(function (val) { return qs.parse(val).toObject(); });
      assert.deepEqual(f, { a: ['b'], q: [{ x: ['y'], y: ['z'] }] });
    })();

    // nested in colon
    (function() {
      var f = qs.parse('a:b;q:x%3Ay%3By%3Az', ';', ':').toObject();
      f.q = f.q.map(function (val) { return qs.parse(val,  ';', ':').toObject(); });
      assert.deepEqual(f, { a: ['b'], q: [{ x: ['y'], y: ['z'] }] });
    })();

    assert.doesNotThrow(function() {
      qs.parse(undefined);
    });

    assert.deepEqual({}, qs.parse().toObject());


    // Test limiting
    assert.equal(
        Object.keys(qs.parse('a=1&b=1&c=1', null, null, { maxKeys: 1 }).toObject()).length,
        1);
  });
});
// jscs:enable
// jshint ignore:end
