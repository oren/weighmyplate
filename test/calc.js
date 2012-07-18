// test using the bulit-in assert module

// == and === are the same except for type conversion made by ==
// assert.equal uses ==
// assert.strictEqual uses ===
// assert.deepEqual doesn't care amount the reference in memory

var assert = require('assert');
var calcTotal = require('../public/js/calc.js');

var eatenFood = [];
var availableFood = [];

assert.deepEqual(calcTotal(eatenFood, availableFood), {calories: 0, protein: 0, carbs: 0, fat: 0});


eatenFood = [{name: 'egg', qty: 10}];
availableFood = [
  {name: 'egg', cal: 80, p: 7, c: 3, f: 6},
  {name: 'chicken', cal: 120, p: 20, c: 3, f: 5}
];

assert.deepEqual(calcTotal(eatenFood, availableFood), {calories: 800, protein: 70, carbs: 30, fat: 60});

eatenFood = [{name: 'egg', qty: 10}, {name: 'chicken', qty: 2}];
availableFood = [
  {name: 'egg', cal: 80, p: 7, c: 3, f: 6},
  {name: 'chicken', cal: 120, p: 20, c: 3, f: 5}
];

assert.deepEqual(calcTotal(eatenFood, availableFood), {calories: 1040, protein: 110, carbs: 36, fat: 70});
