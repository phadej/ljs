#!/usr/bin/env node
/**
  # ljs

  > Generate docs from your source

  [![Build Status](https://travis-ci.org/phadej/grunt-literate.svg)](https://travis-ci.org/phadej/ljs)
  [![NPM version](https://badge.fury.io/js/ljs.svg)](http://badge.fury.io/js/ljs)
  [![Dependency Status](https://gemnasium.com/phadej/ljs.svg)](https://gemnasium.com/phadej/ljs)
  [![Code Climate](https://img.shields.io/codeclimate/github/phadej/ljs.svg)](https://codeclimate.com/github/phadej/ljs)

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
*/
/// plain ../CHANGELOG.md
/// plain ../CONTRIBUTING.md
/// plain ../related-work.md
/// plain ../LICENSE

"use strict";

var program = require("commander");
var fs = require("fs");
var path = require("path");

var literate = require("../lib/literate.js");

var pkgJson = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json")).toString());

function toBool(x) {
  if (x === "true") {
    return true;
  } else if (x === "false") {
    return false;
  } else {
    return true;
  }
}

program.usage("[options] file.js");
program.version(pkgJson.version);
program.option("-o, --output <file>", "Output file");
program.option("-c, --code <switch>", "Include code in output file", toBool);

function cli(argv) {
  program.parse(argv);

  if (program.args.length !== 1) {
    console.error("Error: input file is required");
    console.log(program.help());
    return 0;
  }

  // Literate
  var filename = program.args[0];
  var litContents;
  try {
    litContents = literate(filename, { code: program.code });
  } catch (e) {
    console.error("Error: while literating -- " + e.message);
    return 1;
  }

  // Output
  if (program.output) {
    fs.writeFileSync(program.output, litContents);
  } else {
    console.log(litContents);
  }
}

var ret = cli(process.argv);
/* eslint-disable no-process-exit */
process.exit(ret);
/* eslint-enable no-process-exit */
