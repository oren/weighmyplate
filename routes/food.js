db = require('../food.js');
module.exports = food;

// GET /food -   get all food from DB
// or POST /food -   add new eaten food to DB
function food (req, res) {
  switch(req.method) {
    case 'GET':
      return getAllFood(req, res);
      break;
    case 'POST':
      return addEatenFood(req, res);
      break;
    default: 
      return res.error(405);
  }
};

function addEatenFood(req, res) {
  console.log('add eaten food');
  res.end();
};

function getAllFood(req, res) {
  db.allFood(function(err, items){ 
    if(err) {
      res.statusCode = 500;
      res.end();
    } else {
      res.end(JSON.stringify(items));
    }
  });
};
