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

function addEatenFood(userID, data, callback) {
  console.log('data', data);

  require.main.exports.usersCollection.update({ 'email':'test@gmail.com' }, {'$set': {'foodEaten': data.food, 'total': data.total}}, function(err, user) {
    if (err) { 
      console.warn(err.message); 
      callback(err);
    }
    else {
      callback(null, user);
    }
  });
};
