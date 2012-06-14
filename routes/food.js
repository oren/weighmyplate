module.exports = food;

// getting our contacts from the 'database' - contacts.json
//var allFood = require("../models/all-food.js")

function food (req, res) {
  var items = [
    {name:'egg', cal:80, p:7, c:1, f:4},
    {name:'bread', cal:80, p:7, c:1, f:4},
    {name:'nuts', cal:80, p:7, c:1, f:4},
    {name:'chicken breast', cal: 120, p:4, c:2, f:1},
    {name: 'protein', cal: 120, p:21, c:2, f:0},
    {name: 'salmon', cal: 120, p:21, c:2, f:0}
  ];

  res.end(JSON.stringify(items));
};
