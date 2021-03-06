.PHONY : all test jshint eslint jscs literate david dist

JSHINT=node_modules/.bin/jshint
ESLINT=node_modules/.bin/eslint
JSCS=node_modules/.bin/jscs
DAVID=node_modules/.bin/david
LJS=bin/ljs.js

SRC=lib bin

all : test

test : jshint eslint jscs david

jshint : 
	$(JSHINT) $(SRC)

eslint :
	$(ESLINT) $(SRC)

jscs : $(JSCS)
	$(JSCS) $(SRC)

david :
	$(DAVID)

literate : 
	 $(LJS) --no-code -o README.md bin/ljs.js

dist : test literate
	git clean -fdx -e node_modules
