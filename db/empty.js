// db stuff
var mongoHost = process.env['MONGO_HOST'] != null ? process.env['MONG__HOST'] : 'localhost';
var mongoPort = process.env['MONGO_PORT'] != null ? process.env['MONGO_PORT'] : 27017;
var mongoDbName = process.env['MONGO_NAME'] != null ? process.env['MONGO__NAME'] : 'yunobig-development';

var mongo = require('mongodb');
var server = new mongo.Server(mongoHost, mongoPort, {});
var db = new mongo.Db(mongoDbName, server);
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
