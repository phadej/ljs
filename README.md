# ljs

> Generate docs from your source

[![Build Status](https://travis-ci.org/phadej/grunt-literate.png)](https://travis-ci.org/phadej/ljs)
[![Code Climate](https://codeclimate.com/github/phadej/ljs.png)](https://codeclimate.com/github/phadej/ljs)
[![NPM version](https://badge.fury.io/js/ljs.png)](http://badge.fury.io/js/ljs)
[![Dependency Status](https://gemnasium.com/phadej/ljs.png)](https://gemnasium.com/phadej/ljs)

## command line

If `ljs` is installed globally,
you can use `ljs` command line tool to process your literate javascript files

```sh
$ ljs -c -o foo.md foo.js
$ ljs --help
```

### library

You can also use *grunt-literate* as a normal library:

```js
var documentation = require("grunt-literate")("hello.js", { code: true });
```


## Release History

- 0.2.0 Initial release
	- Split out of [grunt-literate](https://github.com/phadej/grunt-literate) 0.1.5

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality.
Lint and test your code using [Grunt](http://gruntjs.com/).
Make a pull request, but don't commit `README.md`!

## Related work

This task could be abused to do literate programming.
[Docco](http://jashkenas.github.io/docco/) is similar tool,
however *ljs* is markup-language-agnostic.


The MIT License (MIT)

Copyright (c) 2013, 2014 Oleg Grenrus

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
