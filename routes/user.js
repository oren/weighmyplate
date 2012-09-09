users = require('../models/user.js');
module.exports = user;

// GET /food -   get all food from DB
// or POST /food -   add new eaten food to DB
function user(req, res) {
  switch(req.method) {
    case 'GET':
      // return res.end(JSON.stringify({'food':[], 'foodEaten':[], 'user':{}}));
      return getUser(req, res);
      break;
    case 'POST':
      // return addEatenFood(req, res);
      break;
    case 'PUT':
      return addEatenFood(req, res);
      break;
    default: 
      return res.error(405);
  }
};

// get user from db
function getUser(req, res) {
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

function addEatenFood(req, res) {
  var payload = '';
  req.setEncoding('utf8');

  req.on('data', function (data) {
    payload += data;
  });

  req.on('end', function () {
    var userID = 1;
    var data = JSON.parse(payload);

    // add to available food
    if(data.newFood) {
      console.log('addin new food');
      users.addAvailableFood(userID, data.newFood, function(err, user) { 
        if(err) {
          res.statusCode = 500;
          res.end();
        } else {
          res.end();
        }
      });
    }

    console.log('adding eaten food');
    users.addEatenFood(userID, data, function(err, user) { 
      if(err) {
        res.statusCode = 500;
        res.end();
      } else {
        res.end();
      }
    });
    res.end();
  });
};
