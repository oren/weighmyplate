'use strict';

/* Controllers */

// function FoodCtrl($scope, $http, $cookies) {

angular.module('calApp').controller('AvailableCtrl', function($scope, $http, $cookies) {

});

angular.module('calApp').controller('EatenCtrl', function($scope, $http, $cookies) {

});

// function FoodCtrl($scope, $http, $cookies) {
angular.module('calApp').controller('FoodCtrl', function($scope, $http, $cookies) {
  var calcTotal = require('./calc.js');
  var calcExtraTotal = require('./calcExtra.js');
  var roundTotal = require('./roundTotal.js');

  initState($scope, $cookies);

  // comment when online
  getUser('test@gmail.com', $scope, $http);

  var currentUser = 'bob@example.com';
 
  navigator.id.watch({
    loggedInUser: currentUser,
    onlogin: function(assertion) {
      // A user has logged in! Here you need to:
      // 1. Send the assertion to your backend for verification and to create a session.
      // 2. Update your UI.
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
    },
    onlogout: function() {
      // A user has logged out! Here you need to:
      // Tear down the user's session by redirecting the user or making a call to your backend.
      // Also, make sure loggedInUser will get set to null on the next page load.
      // (That's a literal JavaScript null. Not false, 0, or undefined. null.)
      // $.ajax({
      //   type: 'POST',
      //   url: '/auth/logout', // This is a URL on your website.
      //   success: function(res, status, xhr) { window.location.reload(); },
      //   error: function(res, status, xhr) { alert("logout failure" + res); }
      // });
    }
  });

  //event handlers

  // add numbers to daily total
  $scope.addItem = function(item) {
    $scope.total.calories += item.cal;
    $scope.total.protein += item.p;
    $scope.total.carbs += item.c;
    $scope.total.fat += item.f;
    $scope.roundedTotal = roundTotal($scope.total);

    addEatenFood(item.name);
    addEatenFoodToDB($http, $scope.eaten, $scope.total);
    updateTitle($scope.roundedTotal.calories);
  };

  $scope.addFood = function() {
    $scope.searchText = '';
    if ($scope.showAdd) {
      $scope.addIcon = 'icon-plus';
      $scope.showAdd = false;
    } else {
      $scope.addIcon = 'icon-minus';
      $scope.showAdd = true;
    }
  };

  $scope.editFood = function() {
    $scope.searchText = '';
    if($scope.editBtnText === 'Edit Food') {
      $scope.availableFoodClass = 'btn btn-success';
      $scope.editBtnText = 'Save Food';
      $scope.editBtnClass = 'save';
    } else {
      $scope.availableFoodClass = 'btn';
      $scope.editBtnText = 'Edit Food';
      $scope.editBtnClass = 'edit';
    };
  };

  // add extra food to totals and to db
  $scope.addExtra = function() {
    console.log('scope', $scope);

    var newFood = {
      name: $scope.extraFood.name,
      cal: $scope.extraFood.cal ? parseInt($scope.extraFood.cal, 10) : 0,
      p: $scope.extraFood.p ? parseInt($scope.extraFood.p, 10) : 0,
      c: $scope.extraFood.c ? parseInt($scope.extraFood.c, 10) : 0,
      f: $scope.extraFood.f ? parseInt($scope.extraFood.f, 10) : 0
    };

    $scope.total.calories += newFood.cal;
    $scope.total.protein += newFood.p; 
    $scope.total.carbs += newFood.c;
    $scope.total.fat += newFood.f;
    $scope.roundedTotal = roundTotal($scope.total);

    $scope.foodEaten = true;

    // don't add the food to available food since it's temporary
    if($scope.temporaryFood) {
      $scope.extra.push(newFood);
      newFood = null;
      addExtraFoodToDB($http, $scope.extra, newFood, $scope.total);
    } else {
      $scope.items.push(newFood);
      $scope.addItem(newFood);
      addExtraFoodToDB($http, $scope.extra, newFood, $scope.total);
    };
    
    updateTitle($scope.roundedTotal.calories);
  };

  $scope.cancelAdd = function() {
    $scope.addButton = true;
    $scope.showAdd = false;
  };

  $scope.signIn = function() {
    navigator.id.request();
  };

  $scope.update = function() {
    var extraTotal = {
      cal: 0,
      p: 0,
      c: 0,
      f: 0
    };

    if ($scope.extra.length !== 0) {
      extraTotal = calcExtraTotal($scope.extra);
    }

    var total = calcTotal($scope.eaten, $scope.items);

    $scope.total.calories = total.calories + extraTotal.cal;
    $scope.total.protein = total.protein + extraTotal.p;
    $scope.total.carbs = total.carbs + extraTotal.c;
    $scope.total.fat = total.fat + extraTotal.f;;
    $scope.roundedTotal = roundTotal($scope.total);
    updateTitle($scope.roundedTotal.calories);
    
    console.log($scope.eaten);
    var qty;
    $scope.eaten.forEach(function(value) {
      // if value.qty is '' parseFloat will return NaN
      qty = parseFloat(value.qty);
      
      if(isNaN(qty)) {
        value.qty = 0;
      } else {
        value.qty = qty;
      };
    });

    console.log($scope.eaten);
    addEatenFoodToDB($http, $scope.eaten, $scope.total, $scope.extra);
  };

  $scope.clear = function() {
    $scope.foodEaten = false;
    $scope.eaten = [];
    $scope.extra = [];
    $scope.total  = {calories: 0, protein: 0, carbs: 0, fat:0};
    $scope.roundedTotal = roundTotal($scope.total);
    addEatenFoodToDB($http, $scope.eaten, $scope.total, $scope.extra);
    updateTitle($scope.roundedTotal.calories);
  };

  $scope.clearOne = function(item) {
    console.log(item);
    var qty = item.qty;

    // find food in available food
    $scope.items.forEach(function(available) {
      if(item.name === available.name) {
        item = available
      };
    });

    $scope.total.calories -= item.cal * qty;
    $scope.total.protein -= item.p * qty;
    $scope.total.carbs -= item.c * qty;
    $scope.total.fat -= item.f * qty;
    $scope.roundedTotal = roundTotal($scope.total);

    var i = 0;

    // remove item from eaten array
    $scope.eaten.forEach(function(value) {
      if(item.name === value.name) {
        $scope.eaten.splice(i,1);
      };
      i += 1;
    });

    console.log('total', $scope.total);

    addEatenFoodToDB($http, $scope.eaten, $scope.total);
    updateTitle($scope.roundedTotal.calories);
    if ($scope.total.calories === 0) {
      $scope.foodEaten = false;
    }
  };

  $scope.qtyChanged = function() {
    $scope.update();
  };
  
  //helpers

  // get user from DB
  function getUser(email, $scope, $http) {
    $http({method: 'GET', url: '/user'}).
      success(function(data, status, headers, config) {
        $scope.items = data.food;
        if (data.foodEaten !== undefined && data.foodEaten.length > 0) {
          $scope.foodEaten = true;
        }

        $scope.eaten = (data.foodEaten === undefined) ? [] : data.foodEaten;
        if(data.total !== undefined) {
          $scope.total = data.total;
          $scope.roundedTotal = roundTotal($scope.total);
        };
        if(data.total !== undefined && data.total.calories !== 0) {
          $scope.extra = data.extraFood;
          $scope.foodEaten = true;
          updateTitle($scope.roundedTotal.calories);
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
  function addEatenFoodToDB($http, foodEaten, total, extra) {
    $http({method: 'PUT', url: '/user', data: {food: foodEaten, total: total, extraFood: extra}}).
      success(function(data, status, headers, config) {
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with status
        // code outside of the <200, 400) range
        console.log('error', status);
      });
  };

  // add eaten food to DB
  // newFood is {} or {'name':'egg', 'cal':'90', 'p':'1', 'c';'2', 'f':'3'}
  function addExtraFoodToDB($http, extraFood, newFood, total) {
    $http({method: 'PUT', url: '/user', data: {extraFood: extraFood, newFood: newFood, total: total}}).
      success(function(data, status, headers, config) {
        $scope.extraFood = null;
        updateTitle($scope.roundedTotal.calories);
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
    $scope.roundedTotal = roundTotal($scope.total);
    $scope.foodEaten = false;
    $scope.showAdd = false;
    $scope.addButton = true;
    $scope.temporaryFood = false;
    $scope.eaten = [];
    $scope.extra = [];
    $scope.extraFood = null;
    $scope.availableFoodClass = 'btn';
    $scope.editBtnText = 'Edit Food';
    $scope.editBtnClass = 'edit';
    $scope.addIcon = 'icon-plus';
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

  function updateTitle(calories) {
    document.title = calories;
  };
});
