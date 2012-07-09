var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : 27017;
var dbName = process.env['MONGO_NODE_DRIVER_DB_NAME'] != null ? process.env['MONGO_NODE_DRIVER_DB_NAME'] : 'yunobig-develapment';

var mongo = require('mongodb');
var server = new mongo.Server(host, port, {});
var db = new mongo.Db(dbName, server);
var user = null;

db.open(function(err, db) {
  if(err) {
    console.log('error opening mongo. make sure mongo is running');
    process.exit(1);
  } else {
    console.log("connected to mongo");
    user = new mongo.Collection(db, 'users');
    foo();
  }
});


function foo() { 
  user.remove(function(err, count) {
    if(err) {
      console.log('Error while removeing food collection', err);
      process.exit(1);
    }
    else {
      console.log('users collection is empty');
      process.exit(0);
    };
  });
};
