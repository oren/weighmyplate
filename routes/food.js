db = require('../food.js');
module.exports = food;

// getting our contacts from the 'database' - contacts.json
//var allFood = require("../models/all-food.js")

function food (req, res) {

  db.allFood(function(err, items){ 
    if(err) {
      res.statusCode = 500;
      return res.end();
    } else {
      console.log('results',items);
      res.end(JSON.stringify(items));
    }
  });
};
