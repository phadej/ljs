"use strict";

/**
  ### Library

  You can also use *grunt-literate* as a normal library:

  ```
  var documentation = require("grunt-literate")("hello.js", { code: true });
  ```
*/

var lex = require("./lex.js");
var fs = require("fs");
var path = require("path");
var assert = require("assert");
var glob = require("glob");
var _ = require("underscore");

var whitespaceEndRe = /^\s*$/;
var whitespaceRe = /^(\s*)/;

function isWhitespace(str) {
  return whitespaceEndRe.test(str);
}

function stripShebang(contents) {
  var m = contents.match(/^#!\/[^\n]*\n/);
  return m ? contents.substr(m[0].length) : contents;
}

function fileDirective(filename, value, regexp, callback) {
  var m = value.match(regexp);
  if (m) {
    var directivePattern = m[1];
    var globPattern = path.join(path.dirname(filename), directivePattern);
    var files = glob.sync(globPattern);
    if (files.length === 0) {
      throw new Error(directivePattern + " doesn't match any files");
    }
    files.forEach(callback);
    return true;
  } else {
    return false;
  }
}

function getTokens(filename) {
  var contents = fs.readFileSync(filename).toString();
  contents = stripShebang(contents);
  var tokens = lex(contents);

  var resTokens = [];
  tokens.forEach(function (token) {
    var r;

    if (token.type === "Comment" && token.value.type === "Line" && token.value.value[0] === "/") {
      var value = token.value.value.substr(1);
      r = fileDirective(filename, value, /^\s*plain\s+(.*?)\s*$/, function (includename) {
        resTokens.push({
          type: "Plain",
          value: fs.readFileSync(includename).toString(),
        });
      });
      if (r) { return; }

      r = fileDirective(filename, value, /^\s*include\s+(.*?)\s*$/, function (includename) {
        resTokens = resTokens.concat(getTokens(includename));
      });
      if (r) { return; }

      assert(false, "unknown directive: " + value);

    } else {
      token.raw = contents.substr(token.range[0], token.range[1] - token.range[0]);
      resTokens.push(token);
    }
  });

  // End-of-file marker
  resTokens.push({
    type: "EOF",
    value: "",
  });

  return resTokens;
}

function unindent(value) {
  var lines = value.split(/\n/);
  var first = _.find(lines, function (line) { return !isWhitespace(line); } );
  var indent = first ? whitespaceRe.exec(first)[1] : "";

  // Drop empty lines at the beginning of the literate comment
  while (true) {
    if (lines[0] !== undefined && isWhitespace(lines[0])) {
      lines.shift();
    } else {
      break;
    }
  }

  // unindent lines
  lines = lines.map(function (line) {
    if (line.indexOf(indent) === 0) {
      return line.replace(indent, "");
    } else if (isWhitespace(line)) {
      return "";
    } else {
      return line;
    }
  });

  // Each line should have newline char after, also the last
  return lines.join("\n") + "\n";
}

function literate(filename, opts) {
  opts = opts || {};
  var code = opts.code || false;
  var codeOpen = opts.codeOpen || "\n```js\n";
  var codeClose = opts.codeClose || "\n```\n\n";

  var tokens = getTokens(filename);

  var state = "code";
  var content = "";

  var codeBuffer = ""; // buffer for code output

  function appendCode() {
     if (state === "code") {
      state = "text";
      if (!isWhitespace(codeBuffer)) {
        content += codeOpen + codeBuffer.replace(/^(?:\s*\n)+/, "").replace(/[\s\n]*$/, "") + codeClose;
      }
      codeBuffer = "";
    }
  }

  function appendText(value) {
    if (content === "") {
      content = value;
    } else {
      content += "\n" + value;
    }
  }

  tokens.forEach(function (token) {
    if (token.type === "Plain") {
      appendCode();
      appendText(token.value);

    } else if (token.type === "EOF") {
      appendCode();
      appendText("");

    } else if (token.type === "Comment" && token.value.type === "Block" && token.value.value[0] === "*") {
      appendCode();

      // literate comment
      var comment = token.value;

      // block comment starting with /**
      var value = comment.value.slice(1);
      appendText(unindent(value));
    } else if (code) {
      // Code
      if (state !== "code") {
        state = "code";
        codeBuffer = "";
      }

      codeBuffer += token.raw;
    }
  });

  // Append code at end of the file
  appendCode();

  // Just one newline at eof
  content = content.replace(/\n+$/, "\n");

  return content;
}

module.exports = literate;
