// calculate totals of extra food
//
// availableFood - [{name: 'egg', cal: 80, p: 7, c: 3, f: 6}, {name: 'chicken', cals: 120, p: 7, c: 3, f: 6}]
// result - {"cal":200,"p":27,"c":0,"f":11}
module.exports = calculateExtraTotal;

function calculateExtraTotal(extraFood) {
  var result = {cal: 0, p: 0, c: 0, f: 0};

  function addValues(element, index, array) {
    result.cal += element.cal;
    result.p += element.p;
    result.c += element.c;
    result.f += element.f;
  };

  extraFood.forEach(addValues);

  return result;
};

