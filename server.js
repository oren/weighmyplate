//core modules
var http = require('http');

//non-core modules
var mapleTree = require('mapleTree');
var ErrorPage = require('error-page');
var Templar = require('templar');
// var ejs = require('ejs');

// configs
var environment = process.env.NODE_ENV || 'development';
var config = require('./config/' + environment + '.js');

// var config = { port: 3000, engine: ejs, templates: './templates' };
var templarOptions = { engine: config.engine, folder: config.templates };
var router = new mapleTree.RouteTree();
Templar.loadFolder('./templates')

var webSitePort = process.env.PORT || config.port;

// db stuff
var mongoHost = process.env['MONGO_HOST'] != null ? process.env['MONG__HOST'] : 'localhost';
var mongoPort = process.env['MONGO_PORT'] != null ? process.env['MONGO_PORT'] : 27017;
var mongoDbName = process.env['MONGO_NAME'] != null ? process.env['MONGO__NAME'] : 'yunobig-development';

var mongo = require('mongodb');
var server = new mongo.Server(mongoHost, mongoPort, {});
var db = new mongo.Db(mongoDbName, server);
var usersCollection = null;

db.open(function(err, db) {
  if(err) {
    console.log('error opening mongo. make sure mongo is running');
    process.exit(1);
  } else {
    console.log("connected to mongo");
    usersCollection = new mongo.Collection(db, 'users');
    module.exports.usersCollection = usersCollection;
    router.define( '/user', require('./routes/user.js') );
    router.define( '/', require('./routes/home.js') );
    router.define( '/login', require('./routes/login.js') );
    // route static files
    router.define( '/*', require('./routes/static.js') )
  }
});


// request goes here
http.createServer(function(req, res) {
  res.error = ErrorPage(req, res, {});
  res.template = Templar(req, res, templarOptions);
  router.match(req.url).fn(req, res);
}).listen(webSitePort);

console.log('website running. port ' + webSitePort);
