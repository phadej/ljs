.PHONY : all test jsverify literate dist

JSHINT=node_modules/.bin/jshint
LJS=bin/ljs.js

all : test

test : jshint

jshint : 
	$(JSHINT) lib/*.js bin/*.js

literate : 
	 $(LJS) -c false -o README.md bin/ljs.js

dist : test literate
	git clean -fdx -e node_modules
