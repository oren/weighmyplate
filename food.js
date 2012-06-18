// save array of food
module.exports.save = save;
module.exports.remove = remove;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : 27017;
var dbName = process.env['MONGO_NODE_DRIVER_DB_NAME'] != null ? process.env['MONGO_NODE_DRIVER_DB_NAME'] : 'yunobig-develapment';

var mongodb = require('mongodb');
var server = new mongodb.Server(host, port, {});
console.log("Connecting to " + host + ":" + port);

// save food to mongoDB
// items = array of food objects
// [ {name: 'egg', cal: 78, p:6.3, c:0.6, f:5.3}, ... ] 
function save(items, callback) {
  new mongodb.Db(dbName, server, {}).open(function (error, client) {
    if (error) throw error;
    var collection = new mongodb.Collection(client, 'food');
    collection.insert(items, {safe:true}, function(err, objects) {
      if (err) console.warn(err.message);
      if (err && err.message.indexOf('E11000 ') !== -1) {
        // this _id was already inserted in the database
      }
      callback(null, items);
    });
  });
};

// remove the food collection
function remove(callback) {
  new mongodb.Db(dbName, server, {}).open(function (error, client) {
    if (error) throw error;
    var collection = new mongodb.Collection(client, 'food');
    collection.remove(function(err, count) {
      if (err) { console.warn(err.message); }
      else {
        callback(null, count);
      }
    });
  });
};

