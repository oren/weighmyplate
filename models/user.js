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

function addEatenFood(userID, food, callback) {
  require.main.exports.usersCollection.update({ 'email':'test@gmail.com' }, {'$set': {'foodEaten': food}}, function(err, user) {
    if (err) { 
      console.warn(err.message); 
      callback(err);
    }
    else {
      callback(null, user);
    }
  });
};
