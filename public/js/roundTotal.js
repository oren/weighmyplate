// round float numbers into int
//
// total  = {calories: 1.32, protein: 2.6, carbs: 0, fat:1.4}
// result = {calories: 2, protein: 3, carbs: 0, fat:1}
module.exports = roundTotal;

function roundTotal(total) {
  var result = {};

  result['calories'] = Math.round(total.calories);
  result['protein'] = Math.round(total.protein);
  result['carbs'] = Math.round(total.carbs);
  result['fat'] = Math.round(total.fat);

  return result;
};

