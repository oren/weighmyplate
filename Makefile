db-seed:
	node db/seed.js

db-empty:
	node db/empty.js

test: 
	test-unit test-end2end

test-unit:
	NODE_ENV=test node test/unit/calc.js

test-end2end:
	NODE_ENV=test node test/end2end/createFood.js
