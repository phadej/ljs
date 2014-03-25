#!/usr/bin/env node
/**
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
*/
/// plain ../CHANGELOG.md
/// plain ../CONTRIBUTING.md
/// plain ../related-work.md
/// plain ../LICENSE

"use strict";

var optimist = require("optimist");
var fs = require("fs");

var literate = require("../lib/literate.js");

optimist.usage("ljs [options] file.js");

optimist.boolean("h").options("h", {
  alias: "help",
  describe: "Show brief help information",
});

optimist.boolean("v").options("v", {
  alias: "version",
  describe: "Display version information and exit.",
});

optimist.options("o", {
  alias: "output",
  describe: "Output file.",
});

optimist.boolean("c").options("c", {
  alias: "code",
  describe: "Include code in output file.",
  default: true,
});

function cli(argv) {
  var options = optimist.parse(argv);

  if (options.help) {
    console.log(optimist.help());
    return 0;
  }

  if (options.version) {
    var pkg = JSON.parse(fs.readFileSync(__dirname + "/../package.json"));
    console.log("jsgrep, part of jsstana version " + pkg.version);
    return 0;
  }

  if (options._.length !== 1) {
    console.error("Error: input file is required");
    console.log(optimist.help());
    return 0;
  }

  // Literate
  var filename = options._[0];
  var litContents;
  try {
    litContents = literate(filename, { code: options.code });
  } catch (e) {
    console.error("Error: while literating -- " + e.message);
    return 1;
  }

  // Output
  if (options.o) {
    fs.writeFileSync(options.o, litContents);
  } else {
    console.log(litContents);
  }
}

var ret = cli(process.argv.slice(2));
process.exit(ret);
