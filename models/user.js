module.exports.getUser = getUser;

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
