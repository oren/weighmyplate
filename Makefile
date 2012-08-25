db-seed:
	node db/seed.js

db-empty:
	node db/empty.js

test: test-unit test-end2end

test-unit:
	NODE_ENV=test node test/unit/calc.js

test-end2end:
	NODE_ENV=test node test/end2end/createFood.js

browserify:
	./node_modules/browserify/bin/cmd.js public/js/controllers.js public/js/calc.js public/js/calcExtra.js -o public/js/bundle.js  

ugly:
	./node_modules/uglify-js/bin/uglifyjs public/js/bundle.js -o public/js/miniBundle.js 

bundle:
	./node_modules/browserify/bin/cmd.js public/js/controllers.js public/js/calc.js | ./node_modules/uglify-js/bin/uglifyjs -o public/js/miniBundle.js

stylus:
	./node_modules/stylus/bin/stylus public/css/app.styl -w

dev:
	mongod & ./node_modules/stylus/bin/stylus public/css/app.styl -w & ./node_modules/browserify/bin/cmd.js public/js/controllers.js public/js/calc.js public/js/calcExtra.js -o public/js/bundle.js -w & node server.js
