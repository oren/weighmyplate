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
    users = new mongo.Collection(db, 'users');
    addUser();
  }
});

function addUser() {
  var user = {
    'name': 'jhon',
    'email': 'test@gmail.com'
  };

  user.food = [
  { name: 'yogurt 1 cup', cal: 120, p: 22, c:5 , f:0 },
  { name: 'cottage 100p', cal: 88, p: 12.32, c:3.52, f:2.2 },
  { name: 'egg', cal: 78, p: 6.3, c:0.6, f:5.3 },
  { name: 'egg white', cal: 17, p: 3.58, c:0.24, f:0.06 },
  { name: 'egg white liquid 100g', cal: 54, p: 10.86, c:0, f:0 },
  { name: 'protein', cal: 126, p: 24, c:3, f:2 },
  { name: 'chicken breast', cal: 120, p: 18.25, c:0, f:4.7 },
  { name: 'turkey %0.5', cal: 107.14, p: 23.21, c:0, f:0.44 },
  { name: 'beef %5', cal: 134, p: 21.42, c:0, f:4.46 },
  { name: 'beef %15', cal: 214, p: 19.34, c:0, f:15.18 },
  { name: 'pork', cal: 115.7, p: 21.36, c:0, f:4 },
  { name: 'liver, pork', cal: 165, p:26, c:3.8, f:4.4 },
  { name: 'salmon', cal: 168, p: 21, c:0, f:8.8 },
  { name: 'tilapia', cal: 96, p: 20.8, c:0, f:1.7 },
  { name: 'sardins', cal: 140.19, p: 19, c:0, f:7 },
  { name: 'smoked herring', cal: 242, p: 21.36, c:0, f:19.58 },
  { name: 'octopus', cal: 55, p: 10, c:1.5, f:0.7 },
  { name: 'chipotle bowl', cal: 485, p: 43, c:55, f:11 },
  { name: 'chipotle bowl+', cal: 615, p: 44, c:59, f:24 },
  { name: 'shrimp 10g', cal: 10, p: 2.1, c:0, f:0.1 },
  { name: 'turkey meatball', cal: 50, p: 6, c:2.5, f:2 },
  { name: 'tuna - water', cal: 100, p: 22, c:0, f:1 },
  { name: 'tuna - oil', cal: 200, p: 20, c:0, f:12 },
  { name: 'sashimi', cal: 115, p: 25, c:0, f:1 },
  { name: '1 scallop', cal: 35, p: 2.9, c:1.68, f:2.9 },

  { name: 'feta 28g', cal: 70, p: 6, c:2, f:4 },
  { name: 'oats 60g', cal: 225, p: 7.5, c:40.5, f:4.5 },
  { name: 'milk %1 100g', cal: 48, p: 4, c:5.6, f:1 },
  { name: 'parmesan cheese 1tbsp', cal: 20, p: 2, c:0, f:1.5 },
  { name: 'green beans cup', cal: 44, p: 2.4, c:10, f:0.4 },
  { name: 'black beans 100g', cal: 84.6, p: 4.6, c:14.6, f:0 },
  { name: 'lentil soup 100g', cal: 75, p: 4.2, c:10.73, f:1.85 },
  { name: 'black rice 50g', cal: 170, p: 4, c:31, f:3.5 },
  { name: 'rice 50g', cal: 55, p: 1, c:12, f:0.3 },
  { name: 'udon noodles 100g', cal: 136, p: 3.2, c:28, f:1.2 },
  { name: 'nato', cal: 120, p: 10, c:5, f:6 }, //55g
  { name: 'gobo 100g', cal: 70.66, p: 1.17, c:17.66, f:0 },
  { name: 'banana', cal: 105, p: 1.3, c:27, f:0.4 },
  { name: 'potatoes 100g', cal: 93, p: 2, c:21.6, f:0.1 },
  { name: 'couscous 100g', cal: 380, p: 12, c:80, f:1 },
  { name: 'edamame 80g', cal: 120, p: 10, c:8, f:5 },
  { name: 'gioza', cal: 22, p: 2.5, c:3, f:0.3 },  // wrap + 7 grams of lean beef
  { name: 'tofu 100g', cal: 53, p: 5.8, c:2.3, f:2.3 },
  { name: 'garbanzo beans', cal: 100, p: 3.8, c:14.6, f:0.7 }, // 100g
  { name: 'steel cut oats 30g', cal: 113, p: 3.8, c:20.3, f:1.9 } // calorie king
  ];

  users.save(user, function(err, data){
    if(err) {
      console.log('Error while adding food to DB', err);
      process.exit(1);
    } else {
      console.log('test user was added to DB', data);
      process.exit(0);
    }
  });
};

