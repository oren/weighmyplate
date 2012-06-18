// save array of food
module.exports.save = save;
module.exports.remove = remove;
module.exports.allFood = allFood;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : 27017;
var dbName = process.env['MONGO_NODE_DRIVER_DB_NAME'] != null ? process.env['MONGO_NODE_DRIVER_DB_NAME'] : 'yunobig-develapment';

var mongo = require('mongodb');
var server = new mongo.Server(host, port, {});
var db = new mongo.Db(dbName, server);
var collection = null;

db.open(function(err, db) {
  if(!err) {
    console.log("connected to mongo");
    collection = new mongo.Collection(db, 'food');
  }
});

// save food to mongoDB
// items = array of food objects
// [ {name: 'egg', cal: 78, p:6.3, c:0.6, f:5.3}, ... ] 
function save(items, callback) {
  collection.insert(items, {safe:true}, function(err, objects) {
    if (err) console.warn(err.message);
    if (err && err.message.indexOf('E11000 ') !== -1) {
      // this _id was already inserted in the database
    }
    callback(null, items);
  });
};

// remove the food collection
function remove(callback) {
  collection.remove(function(err, count) {
    if (err) { console.warn(err.message); }
    else {
      callback(null, count);
    }
  });
};

// get all food
function allFood(callback) {
  collection.find().toArray(function(err, results) {
    if (err) { console.warn(err.message); }
    else {
      callback(null, results);
    }
  });
};

