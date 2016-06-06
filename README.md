# querystring-multidict [![Build status](https://travis-ci.org/twolfson/querystring-multidict.svg?branch=master)](https://travis-ci.org/twolfson/querystring-multidict)

Querystring library to support Werkzeug's multidict features

We built `querystring-multidict` for consistent typing when reading query strings (e.g. `.get()` always returns a single string value whereas `querystring`/`qs` can return an array/object depending on user input). Additionally, we added `.fetch()` to make throwing form validation errors easier.

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
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

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
