users = require('../models/user.js');
module.exports = user;

// GET /food -   get all food from DB
// or POST /food -   add new eaten food to DB
function user (req, res) {
  console.log('in route. user function');
  console.log('collection', usersCollection);
  switch(req.method) {
    case 'GET':
      // return res.end(JSON.stringify({'food':[], 'foodEaten':[], 'user':{}}));
      return getUser(req, res);
      break;
    case 'POST':
      // return addEatenFood(req, res);
      break;
    default: 
      return res.error(405);
  }
};

// function addEatenFood(req, res) {
//   var payload = '';
//   req.setEncoding('utf8');
// 
//   req.on('data', function (data) {
//     payload += data;
//   });
// 
//   req.on('end', function () {
//     db.addEatenFood(JSON.parse(payload), function(err, items){ 
//       if(err) {
//         res.statusCode = 500;
//         res.end();
//       } else {
//         res.end();
//       }
//     });
//     res.end();
//   });
// 
// };


function getUser(req, res) {
  console.log('in route');
  var result = {};
  users.getUser(function(err, user){ 
    if(err) {
      res.statusCode = 500;
      res.end();
    } else {
      res.end(JSON.stringify(user));
    }
  });
};

