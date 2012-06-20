// save array of food
module.exports.save = save;
module.exports.remove = remove;
module.exports.allFood = allFood;
module.exports.addEatenFood = addEatenFood;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : 27017;
var dbName = process.env['MONGO_NODE_DRIVER_DB_NAME'] != null ? process.env['MONGO_NODE_DRIVER_DB_NAME'] : 'yunobig-develapment';

var mongo = require('mongodb');
var server = new mongo.Server(host, port, {});
var db = new mongo.Db(dbName, server);
var food = null;
var day = null;

db.open(function(err, db) {
  if(!err) {
    console.log("connected to mongo");
    food = new mongo.Collection(db, 'food');
    day = new mongo.Collection(db, 'day');
  }
});

// save food to mongoDB
// items = array of food objects
// [ {name: 'egg', cal: 78, p:6.3, c:0.6, f:5.3}, ... ] 
function save(items, callback) {
  food.insert(items, {safe:true}, function(err, objects) {
    if (err) console.warn(err.message);
    if (err && err.message.indexOf('E11000 ') !== -1) {
      // this _id was already inserted in the database
    }
    callback(null, items);
  });
};

// remove the food food
function remove(callback) {
  food.remove(function(err, count) {
    if (err) { console.warn(err.message); }
    else {
      callback(null, count);
    }
  });
};

// get all food
function allFood(callback) {
  food.find().toArray(function(err, results) {
    if (err) { console.warn(err.message); }
    else {
      callback(null, results);
    }
  });
};

// add eaten food to a day
function addEatenFood(food, callback) {
  console.log('food', food);
  day.insert({'key1': 'hello'}, {safe:true}, function(err, objects) {
    if (err) console.warn(err.message);
    if (err && err.message.indexOf('E11000 ') !== -1) {
      // this _id was already inserted in the database
    }
    callback(null, food);
  });
};

