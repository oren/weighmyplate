Y U NO BIG?
===========

Calorie counting should be quick and get out of your way.  
the current websites/apps sucks since it takes too much time and not always intuitive to use.  
this site is my attempt in makeing things simpler.

[The Website](http://108.227.82.183:3000)

![Y U NO BIG?](http://images2.fanpop.com/image/photos/11400000/mini-cat-cats-11415636-159-142.jpg)

install
-------

    install node.js from http://nodejs.org/
    npm install # install dependencies

setup
-----

    mongod &
    make db-seed  # load food to DB

run
---

    node server.js

get big
-------

    http://localhost:3000

develop
-------

I use browserify to enjoy CommonJS awesomeness in the client side js.  
it's a command line tool that you run against your js files and bundle them into 1 file.  
in my case it's bundle.js  
i run it manually whenever i change client side js files:  

    ./node_modules/browserify/bin/cmd.js public/js/controllers.js -o public/js/bundle.js -w

there is a watch option but it's not working at the moment.  

I use stylus for css.   
It watches changes on styl files and compile them to .css  

    ./node_modules/stylus/bin/stylus public/css/app.styl -w  

I use supervisor package to restart the node server whenever the code changes.  
it's great for development since i don't need to restart it manualy.  

    supervisor node server.js

here is a nice 1 liner to start development: run mongo, stylus, browserify and node server, all in the backgraund

    mongod & ./node_modules/stylus/bin/stylus public/css/app.styl -w & ./node_modules/browserify/bin/cmd.js public/js/controllers.js -o public/js/bundle.js -w & supervisor node server.js 

tech stack
----------

* [Node.js](http://nodejs.org/) - server side code
* [MongoDB](http://www.mongodb.org/) - DB
* [AngularJS](http://angularjs.org/) - client side MVC framework
* [Zombie.js](http://zombie.labnotes.org/) - end-2-end testing
* [browserify](https://github.com/substack/node-browserify) - CommonJS for client-side js
* [stylus](http://learnboost.github.com/stylus/) for nicer css

