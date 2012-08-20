var assert = require('assert');
var calcExtraTotal = require('../../public/js/calcExtra.js');

extraFood = [
  {name: 'bread', cal: 80, p: 7, c: 3, f: 6},
  {name: 'pizza', cal: 120, p: 20, c: 3, f: 5}
];
 
assert.deepEqual(calcExtraTotal(extraFood), {cal: 200, p: 27, c: 6, f: 11});

// eatenFood = [{name: 'egg', qty: 10}, {name: 'chicken', qty: 2}];
// availableFood = [
//   {name: 'egg', cal: 80, p: 7, c: 3, f: 6},
//   {name: 'chicken', cal: 120, p: 20, c: 3, f: 5}
// ];
// 
// assert.deepEqual(calcTotal(eatenFood, availableFood), {calories: 1040, protein: 110, carbs: 36, fat: 70});
