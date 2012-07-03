module.exports.getUser = getUser;

// get all food
function getUser(callback) {
  usersCollection.findOne({ 'email':'test@gmail.com' }, function(err, user) {
    console.log('find one user');
    if (err) { console.warn(err.message); 
      callback(err);
    }
    else {
      callback(null, user);
    }
  });
};
