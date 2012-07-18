// calculate totals of what I ate
//
// eatenFood - [{name: 'egg', qty: 10}, {name: 'chicken', qty: 1}]
// availableFood - [{name: 'egg', cal: 80, p: 7, c: 3, f: 6}, {name: 'chicken', cals: 120, p: 7, c: 3, f: 6}]
// result - {calories: 100, protein: 50, carbs: 12, fat: 4};
module.exports = calculateTotal;

function calculateTotal(eatenFood, availableFood) {
  var result = {calories: 0, protein: 0, carbs: 0, fat: 0};

  function calcFoodNutrition(food){
    var filtered = availableFood.filter(function(element){
      return (element.name === food.name)
    });

    result.calories += filtered[0].cal * food.qty;
    result.protein += filtered[0].p* food.qty;
    result.carbs += filtered[0].c* food.qty;
    result.fat += filtered[0].f* food.qty;
  };
  
  eatenFood.forEach(calcFoodNutrition);

  return result;
};

