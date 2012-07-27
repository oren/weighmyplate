module.exports.getUser = getUser;
module.exports.addEatenFood = addEatenFood;

// get logged-in user
function getUser(callback) {
  require.main.exports.usersCollection.findOne({ 'email':'test@gmail.com' }, function(err, user) {
    if (err) { 
      console.warn(err.message); 
      callback(err);
    }
    else {
      callback(null, user);
    }
  });
};


// update eaten food and total of a user

// data = { 
//   foodEaten: [
//     { name: 'egg white', qty: 1 },
//     { name: 'egg white liquid 100g', qty: 4 },
//     { name: 'protein', qty: 1 } 
//   ], 
//   total: { 
//     calories: 849,
//     protein: 141.68,
//     carbs: 3.24,
//     fat: 22.75 
//   }
// }
function addEatenFood(userID, data, callback) {
  var food = {'total': data.total}

  if(data.food) {
    food['foodEaten'] = data.food;
  };

  if(data.extraFood) {
    food['extraFood'] = data.extraFood;
  };

  require.main.exports.usersCollection.update({ 'email':'test@gmail.com' }, {'$set': food}, function(err, user) {
    if (err) { 
      console.warn(err.message); 
      callback(err);
    }
    else {
      callback(null, user);
    }
  });
};
