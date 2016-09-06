# querystring-multidict [![Build status](https://travis-ci.org/twolfson/querystring-multidict.svg?branch=master)](https://travis-ci.org/twolfson/querystring-multidict)

Querystring library to support [Werkzeug's MultiDict][werkzeug-multidict] features

We built `querystring-multidict` for consistent typing when reading query strings (e.g. `.get()` always returns a single string value whereas `querystring`/`qs` can return an array/object depending on user input). Additionally, we added `.fetch()` to make throwing form validation errors easier.

[werkzeug-multidict]: http://werkzeug.pocoo.org/docs/0.11/datastructures/#werkzeug.datastructures.MultiDict

## Getting Started
Install the module with: `npm install querystring-multidict`

```js
// Load in our dependencies and parse a query string
var qsMultiDict = require('querystring-multidict');
var multidict = qsMultiDict.parse('foo=bar&baz=qux&baz=quux&corge');
// Stored as {foo: ['bar'], baz: ['qux', 'quux'], corge: ['']}

// Retrieve either first value or array of values
multidict.get('baz'); // 'qux'
multidict.getArray('baz'); // ['qux', 'quux']

// Supports same parameters as querystring.parse
qsMultiDict.parse('w=%D6%D0%CE%C4&foo=bar', null, null,
  {decodeURIComponent: gbkDecodeURIComponent})
// Stored as {w: ['中文'], foo: ['bar']}

// Retrieve first value or raise an assertion error
var multidict2 = qsMultiDict.parse('foo=bar&baz=qux&baz=quux&corge');
multidict2.fetch('bad-key'); // Raises `MultiDictKeyError` with property `key: 'bad-key'`
```

## Documentation
`querystring-multidict` exports the `parse` function and `MultiDictKeyError` constructor on `exports`.

### `MultiDict`
We use a `MultiDict` data structure based on [Werkzeug's implementation][werkzeug-multidict].

#### `multidict.get(key, defaultVal)`
Retrieve the first value from a key in a MultiDict

- key `String` - Reference for where to find stored value
- defaultVal `String` - Optional default value to use when `key` has no values
    - By default, this will be `undefined`

**Returns:**

- val `String|undefined` - First value stored under key
    - If no value is found, then `defaultVal` will be returned

#### `multidict.getArray(key)`
Retrieve all values stored under `key`

- key `String` - Reference for where to find stored values

**Returns:**

- val `Array` - Array of values stored under `key`
    - If no key is found, then an empty array will be returned

#### `multidict.fetch(key)`
Retrieve the first value from a key in a MultiDict or raise a `MultiDictKeyError` when key isn't present

- key `String` - Reference for where to find stored value

**Returns:**

- val `String` - First value stored under key

#### `MultiDictKeyError`
Subclass of an `AssertionError` with additional `key` property

- key `String` - Reference of where key retrieval failed

### `qsMultiDict.parse(str, sep, eq, options)`
Parse a query string into a `MultiDict`

- See Node.js' query string documentation for parameter information
    - https://nodejs.org/api/querystring.html#querystring_querystring_parse_str_sep_eq_options

**Returns:**

- val `MultiDict` - MultiDict representation of query string

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via `npm run lint` and test via `npm test`.

## Donating
Support this project and [others by twolfson][gratipay] via [gratipay][].

[![Support via Gratipay][gratipay-badge]][gratipay]

[gratipay-badge]: https://cdn.rawgit.com/gratipay/gratipay-badge/2.x.x/dist/gratipay.svg
[gratipay]: https://www.gratipay.com/twolfson/

## Unlicense
As of Jun 06 2016, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
