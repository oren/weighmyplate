module.exports = home;

// getting our contacts from the 'database' - contacts.json
var allFood = require("../models/all-food.js")

function home (req, res) {
  allFood(function (er, data) {
    if (er) return res.error(er);

    data = Object.keys(data).map(function (id) {
      return data[id];
    }).sort(function (a, b) {
      return a.date > b.date ? -1 : 1;
    })

    res.template('home.ejs', { title: 'Node.js Website Template', food: data });
  });
};
