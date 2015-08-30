/**
	### Lex.js

	This is for demo of `/// include` directive.
*/
"use strict";

var esprima = require("esprima");

function lex(contents) {
  var syntax = esprima.parse(contents, {
    tokens: true,
    loc: true,
    range: true,
    comment: true,
  });

  var tokens = [];
  var currRange = 0;

  function addWhitespace(from, to) {
    var ws;

    var comments = syntax.comments.filter(function (comment) {
      return comment.range[0] >= from && comment.range[1] <= to;
    });

    comments.forEach(function (comment) {
      if (comment.range[0] !== from) {
        ws = contents.substr(from, comment.range[0] - from);

        tokens.push({
          type: "Whitespace",
          value: ws,
          range: [
            from,
            comment.range[0],
          ],
        });
      }

      tokens.push({
        type: "Comment",
        value: comment,
        range: comment.range,
      });

      from = comment.range[1];
    });

    if (from !== to) {
      ws = contents.substr(from, to - from);

      tokens.push({
        type: "Whitespace",
        value: ws,
        range: [
          from,
          to,
        ],
      });
    }

  }

  // Go thru all tokens esprima returns
  syntax.tokens.forEach(function (token) {
    // Some comments and whitespace skipped
    if (token.range[0] !== currRange) {
      addWhitespace(currRange, token.range[0]);
    }

    tokens.push(token);
    currRange = token.range[1];
  });

  // trailing whitespace
  if (contents.length !== currRange) {
    addWhitespace(currRange, contents.length);
  }

  return tokens;
}

module.exports = lex;
