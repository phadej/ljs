.PHONY : all test jshint eslint literate dist

JSHINT=node_modules/.bin/jshint
ESLINT=node_modules/.bin/eslint
LJS=bin/ljs.js

all : test

test : jshint eslint

jshint : 
	$(JSHINT) lib bin

eslint :
	$(ESLINT) lib bin

literate : 
	 $(LJS) -c false -o README.md bin/ljs.js

dist : test literate
	git clean -fdx -e node_modules
