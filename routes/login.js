module.exports = login;
var http = require('http');
var request = require('request');

function login(req, res) {
  switch(req.method) {
    case 'POST':
      return tryLogin(req, res);
      break;
    default: 
      return res.error(405);
  }
};

function tryLogin(req, res) {
  var assertion = '';
  req.setEncoding('utf8');

  req.on('data', function (data) {
    assertion += data;
  });

  req.on('end', function () {
    verifyAssertion(assertion, res);
  });
};


// POST to browserID and get status and email in a json format
//
// curl -d "assertion=<ASSERTION>&audience=https://mysite.com" "https://browserid.org/verify"
// {
//   "status": "okay",
//   "email": "lloyd@example.com",
//   "audience": "https://mysite.com",
//   "expires": 1308859352261,
//   "issuer": "browserid.org"
// }
function verifyAssertion(assertion, res) {
  var options = {
    'method' : 'POST',
    'uri' : 'https://browserid.org/verify',
    'body' : 'assertion='+ assertion + '&audience=0.0.0.0',
    'headers' : {
      'content-type' : 'application/x-www-form-urlencoded'
    }
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('body', body) 
      res.writeHead(200, {
        'Set-Cookie': 'loggedin=true',
        'Content-Type': 'text/plain'
      });
    } else {
      console.log('body', body);
    }

    res.end(body);
  })
};
