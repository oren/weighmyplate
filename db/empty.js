var food = require('../food.js');

food.remove(function(err, count) {
  if(err) {
    console.log('Error while removeing food collection', err);
  }
  else {
    console.log('food collection is empty');
  };
});

