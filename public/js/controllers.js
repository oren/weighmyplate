'use strict';

/* Controllers */

function FoodCtrl($scope, $http) {
  getAllFood($scope, $http);
  initState($scope);

  // add numbers to daily total
  $scope.addItem = function(item) {
    addEatenFoodToDB($http, item);
    $scope.calories += item.cal;
    $scope.protein += item.p;
    $scope.carbs += item.c;
    $scope.fat += item.f;
    addEatenFood(item.name);
  };

  $scope.addFood = function() {
    $scope.addButton = false;
    $scope.showAdd = true;
  };

  $scope.addFoodToDB = function() {
    console.log('add to db'); 
  };

  $scope.cancelAdd = function() {
    $scope.addButton = true;
    $scope.showAdd = false;
  };

  // get all food from DB
  function getAllFood($scope, $http) {
    $http({method: 'GET', url: '/food'}).
      success(function(data, status, headers, config) {

        $scope.foodEaten = true;
        $scope.items = data.food;
        $scope.eaten = data.eatenFood;
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with status
        // code outside of the <200, 400) range
        console.log('error', status);
      });
  };

  // add eaten food to DB
  function addEatenFoodToDB($http, foodEaten) {
    $http({method: 'POST', url: '/food', data: foodEaten}).
      success(function(data, status, headers, config) {
        console.log('success', status);
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with status
        // code outside of the <200, 400) range
        console.log('error', status);
      });
  };

  function initState($scope) {
    $scope.calories = 0;
    $scope.protein = 0;
    $scope.carbs = 0;
    $scope.fat = 0;
    $scope.foodEaten = false;
    $scope.showAdd = false;
    $scope.addButton = true;
    $scope.eaten = [];
  };

  // update food eaten box
  function addEatenFood(food) {
    $scope.foodEaten = true;
    var found = false;
    var i = 0;

    // add qty to food that was already eaten
    $scope.eaten.forEach(function(value) {
      if(food === value.name) {
        $scope.eaten[i].qty += 1;
        found = true;
      };
      i += 1;
    });

    // first time eating this food
    if(found === false) {
      $scope.eaten.push({name: food, qty: 1});
    };
  };

}

