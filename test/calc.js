var assert = require('assert');
var total = require('../public/js/calc.js');

// assert.equal(total.calculateTotal('test'),{calories: 100, protein: 50, carbs: 12, fat: 4});
assert.deepEqual(total.calculateTotal('test'), {calories: 100, protein: 50, carbs: 12, fat: 4});

