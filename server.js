//core modules
var http = require('http');

//non-core modules
var mapleTree = require('mapleTree');
var ErrorPage = require('error-page');
var Templar = require('templar');
var ejs = require('ejs');

var config = { port: 3000, engine: ejs, templates: './templates' };
var templarOptions = { engine: config.engine, folder: config.templates };
var router = new mapleTree.RouteTree();
Templar.loadFolder('./templates')

router.define( '/', require('./routes/home.js') );
router.define( '/food', require('./routes/food.js') );
router.define( '/login', require('./routes/login.js') );
// route static files
router.define( '/*', require('./routes/static.js') )

// request goes here
http.createServer(function(req, res) {
  res.error = ErrorPage(req, res, {});
  res.template = Templar(req, res, templarOptions);

  router.match(req.url).fn(req, res);

}).listen(process.env.PORT || config.port);

