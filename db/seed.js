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
  { name: 'milk %1 100g', cal: 48, p: 4, c:5.6, f:1 }
    // add_food('parmesan cheese 1tbsp', 20, 2, 0, 1.5)
    // add_food('green beans cup', 44, 2.4, 10, 0.4)
    // add_food('black beans 100g', 84.6, 4.6, 14.6, 0)
    // add_food('lentil soup 100g',75 , 4.2, 10.73, 1.85)
    // add_food('black rice 50g',170 , 4, 31, 3.5)
    // add_food('rice 50g', 55, 1, 12, 0.3)
    // add_food('udon noodles 100g', 136, 3.2 ,28 ,1.2)
    // add_food('nato',120 ,10 ,5 ,6 ) #55 grams
    // add_food('gobo 100g', 70.66, 1.17, 17.66, 0)
    // add_food('banana', 105, 1.3, 27, 0.4)
    // add_food('potatoes 100g', 93, 2, 21.6, 0.1)
    // add_food('couscous 100g', 380, 12, 80, 1)
    // add_food('edamame 80g', 120, 10, 8, 5)
    // add_food('gioza', 22, 2.5, 3, 0.3) #1 wrap + 7 grams of lean beef
    // add_food('tofu 100g', 53, 5.8, 2.3, 2.3)
    // add_food('garbanzo beans', 100, 3.8, 14.6, 0.7) #100g
    // add_food('steel cut oats 30g', 113, 3.8, 20.3, 1.9) #calorieking
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

