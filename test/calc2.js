var assert = require("assert")
var total = require('../public/js/calc.js');

var eatenFood = [];
var availableFood = [];


describe('total', function(){
  describe('#calculateTotal', function(){
    it('should return hash wish zeros if input is empty array', function(){
      assert.deepEqual(total.calculateTotal(eatenFood, availableFood), {calories: 0, protein: 0, carbs: 0, fat: 0});
    })

    it('should return total if food eaten is in available food', function(){
      // eatenFood = [{name: 'egg', qty: 10}];
      // availableFood = [{name: 'egg', cals: 80, protein: 7, carbs: 3, fat: 6}];

      // assert.deepEqual(total.calculateTotal(eatenFood, availableFood), {calories: 800, protein: 70, carbs: 30, fat: 60});
    })
  })
})
