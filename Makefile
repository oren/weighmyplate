db-seed:
	node db/seed.js

db-empty:
	node db/empty.js

# test: test-unit test-acceptance
# 
# test-unit:
# 	@NODE_ENV=test ./node_modules/.bin/mocha \
# 	  --reporter $(REPORTER)
# 
# test-acceptance:
# 	@NODE_ENV=test ./node_modules/.bin/mocha \
# 	  --reporter $(REPORTER) \
# 	  test/acceptance/*.js

