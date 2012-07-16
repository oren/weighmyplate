'use strict';

/* Controllers */

// function FoodCtrl($scope, $http, $cookies) {
angular.module('calApp').controller('FoodCtrl', function($scope, $http, $cookies) {
  initState($scope, $cookies);

  // comment when online
  getUser('test@gmail.com', $scope, $http);

  // add numbers to daily total
  $scope.addItem = function(item) {
    $scope.total.calories += item.cal;
    $scope.total.protein += item.p;
    $scope.total.carbs += item.c;
    $scope.total.fat += item.f;

    addEatenFood(item.name);
    addEatenFoodToDB($http, $scope.eaten, $scope.total);
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

  $scope.signIn = function() {
    navigator.id.get(gotAssertion);  
    return false; 
  };

  var calcTotal = require('./calc.js');
  $scope.setTotal = function() {
    var total = calcTotal($scope.eaten, $scope.food);
    console.log('total', total);

    $scope.total.calories = total.calories;
    $scope.total.protein = total.protein;
    $scope.total.carbs = total.carbs;
    $scope.total.fat = total.fat;
  };

  // get user from DB
  function getUser(email, $scope, $http) {
    $http({method: 'GET', url: '/user'}).
      success(function(data, status, headers, config) {
        // $scope.items = data.food;
        $scope.items = {'egg': '80', 'chicken': '120'};
        if (data.foodEaten !== undefined && data.foodEaten.length > 0) {
          $scope.foodEaten = true;
        }

        $scope.eaten = (data.foodEaten === undefined) ? [] : data.foodEaten;
        if(data.total !== undefined) {
          $scope.total = data.total;
        };
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with status
        // code outside of the <200, 400) range
        console.log('error', status);
      });
  };

  // calculate totals based on array of food
  // [ {name: 'egg', qty: 3}, {name: 'chicken', qty: 2}
  // => {calories: 100, protein: 50, carbs: 12, fat: 4};
  function calculateTotal(food) {
    return {calories: 100, protein: 50, carbs: 12, fat: 4};
  }

  // add eaten food to DB
  function addEatenFoodToDB($http, foodEaten, total) {
    $http({method: 'PUT', url: '/user', data: {food: foodEaten, total: total}}).
      success(function(data, status, headers, config) {
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with status
        // code outside of the <200, 400) range
        console.log('error', status);
      });
  };

  function initState($scope, $cookies) {
    $scope.hideSignup = $cookies.loggedin; //undefined if no cookie
    $scope.total = {calories: 0, protein: 0, carbs: 0, fat: 0};
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

  function gotAssertion(assertion) {
    // got an assertion, now send it up to the server for verification
    if (assertion !== null) {
      $http({method: 'POST', url: '/login', data: assertion }).
        success(function(data, status, headers, config) {
          if (data === null) {
            console.log("couldn't login. no data returned");
            loggedOut();
          } else if(data.status === 'failure') {
            console.log("couldn't login.", data.reason);
            loggedOut();
          } else {
            loggedIn(data);
          }
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with status
          // code outside of the <200, 400) range
          console.log('login failure', status);
        });
    } else {
      loggedOut();
    }
  };

  function loggedOut() {
    console.log('logout the user');
  };

  function loggedIn(data) {
    $scope.hideSignup = true;
    getUser(data.email, $scope, $http);
  };
});
