var food = require('../food.js');

setTimeout(foo, 2000);
    
function foo() { 
  food.remove(function(err, count) {
    if(err) {
      console.log('Error while removeing food collection', err);
    }
    else {
      console.log('food collection is empty');
    };
  });
};
