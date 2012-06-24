module.exports = home;

function home (req, res) {
  // To Get a Cookie
  var cookies = {};
  req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
  });
  
  var loggedin = cookies.loggedin === 'true' ? true : false
  res.template('home.ejs', {'loggedin': loggedin});
};
