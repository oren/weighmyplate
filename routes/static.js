module.exports = assets;

var path = require('path');
var fs = require('fs');

function assets(req, res) {
  var file = path.join('public', req.url)

  fs.readFile(file, function (err, data) {
    if (err) {
      res.statusCode = 404;
      return res.end();
    }
  
    var extension = getExtension(req.url);

    if( extension === '.js' ) {
      res.setHeader("Content-Type", "application/x-javascript");
    } else if(extension === '.css') {
      res.setHeader("Content-Type", "text/css");
    }

    res.end(data);
  })
};

function getExtension(filename) {
  var i = filename.lastIndexOf('.');
  return (i < 0) ? '' : filename.substr(i);
}
