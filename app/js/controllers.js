'use strict';

/* Controllers */

function FoodCtrl($scope, $http) {
  $http({method: 'GET', url: '/someUrl'}).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with status
      // code outside of the <200, 400) range
      console.log('error');
      $scope.items = [
        {name:'egg', cal:80, p:7, c:1, f:4},
        {name:'egg', cal:80, p:7, c:1, f:4},
        {name:'egg', cal:80, p:7, c:1, f:4},
        {name:'chicken breast', cal: 120, p:4, c:2, f:1},
        {name: 'protein', cal: 120, p:21, c:2, f:0},
        {name:'egg', cal:80, p:7, c:1, f:4},
        {name:'chicken breast', cal: 120, p:4, c:2, f:1},
        {name:'egg', cal:80, p:7, c:1, f:4},
        {name:'egg', cal:80, p:7, c:1, f:4},
        {name:'chicken breast', cal: 120, p:4, c:2, f:1},
        {name: 'protein', cal: 120, p:21, c:2, f:0},
        {name:'egg', cal:80, p:7, c:1, f:4}
      ];
    });

  $scope.calories = 0;
  $scope.protein = 0;
  $scope.carbs = 0;
  $scope.fat = 0;

  $scope.eaten = [];

  $scope.addItem = function(item){
    $scope.calories += item.cal;
    $scope.protein += item.p;
    $scope.carbs += item.c;
    $scope.fat += item.f;
    addEatenFood(item.name);
  };

  function addEatenFood(food) {
    var found = false;
    var i = 0;
    $scope.eaten.forEach(function(value) {
      if(food === value.name) {
        $scope.eaten[i].qty += 1;
        found = true;
      };
      i += 1;
    });

    if(found === false) {
      $scope.eaten.push({name: food, qty: 1});
    };
  }
}

