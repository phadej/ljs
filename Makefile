.PHONY : all test jshint eslint jscs literate dist

JSHINT=node_modules/.bin/jshint
ESLINT=node_modules/.bin/eslint
JSCS=node_modules/.bin/jscs
LJS=bin/ljs.js

SRC=lib bin

all : test

test : jshint eslint jscs

jshint : 
	$(JSHINT) $(SRC)

eslint :
	$(ESLINT) $(SRC)

jscs : $(JSCS)
	$(JSCS) $(SRC)

literate : 
	 $(LJS) -c false -o README.md bin/ljs.js

dist : test literate
	git clean -fdx -e node_modules
