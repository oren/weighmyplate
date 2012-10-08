# [www.weighmyplate.com](http://weighmyplate.com)

Calorie counting should be quick and get out of your way.  
this is my attempt in makeing things simpler.

![weighmyplate](http://images2.fanpop.com/image/photos/11400000/mini-cat-cats-11415636-159-142.jpg)

## install

  install [node.js](http://nodejs.org/)
  install [mongodb](http://www.mongodb.org/)

    npm install # install dependencies
    npm install supervisor forever -g

## setup

    make db-seed  # load food to DB

## run

    source scripts/start # start 4 processes: mongo, browserify, stylus and node server
    http://localhost:3000

## run in production

    sudo NODE_ENV=production node server.js  

## stop all processes

    source scripts/stop # stop the 4 processes that started with the 'start' script


## tools used

* browserify - enjoy CommonJS awesomeness in the client side js.  
  it's a command line tool that you run against your js files and bundle them into 1 file (bundle.js).  
* stylus - nicer than css
  It watches changes on styl files and compile them to .css  
* supervisor - restart the node server whenever the code changes.  
  it's great for development since i don't need to restart it manualy.  

## tech stack

* [Node.js](http://nodejs.org/) - server side code
* [MongoDB](http://www.mongodb.org/) - DB
* [AngularJS](http://angularjs.org/) - client side MVC framework
* [Zombie.js](http://zombie.labnotes.org/) - end-2-end testing
* [browserify](https://github.com/substack/node-browserify) - CommonJS for client-side js
* [stylus](http://learnboost.github.com/stylus/) for nicer css

## mongo commands

install - brew install mongodb  
start - mongod  
console - mongo  
stop - killall mongod && rm /data/db/mongod.lock  # on debian: sudo rm /var/lib/mongodb/mongod.lock 
