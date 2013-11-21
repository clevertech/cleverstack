MOCHA_OPTS=
REPORTER = spec
ifeq ($(REPORTER),xunit)
	OUTPUT = > test/out/server.xml
endif

test: test-server

test-all: test-server test-ui

test-server:
	./node_modules/.bin/mocha \
		test/server/unit \
		test/server/integration \
		--require should \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS) \
		$(OUTPUT)

test-ui:
	./node_modules/.bin/karma start test/ui/config/karma.conf.js

.PHONY: test test-all test-server test-ui
