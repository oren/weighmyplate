// test using the bulit-in assert module

// == and === are the same except for type conversion made by ==
// assert.equal uses ==
// assert.strictEqual uses ===
// assert.deepEqual doesn't care amount the reference in memory

var assert = require('assert');
var total = require('../public/js/calc.js');

var eatenFood = [];
var availableFood = [];

assert.deepEqual(total.calculateTotal(eatenFood, availableFood), {calories: 0, protein: 0, carbs: 0, fat: 0});


// eatenFood = [{name: 'egg', qty: 10}];
// availableFood = [{name: 'egg', cals: 80, protein: 7, carbs: 3, fat: 6}];
// 
// assert.deepEqual(total.calculateTotal(eatenFood, availableFood), {calories: 800, protein: 70, carbs: 30, fat: 60});
