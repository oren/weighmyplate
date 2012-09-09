(function(){var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var cached = require.cache[resolved];
    var res = cached? cached.exports : mod();
    return res;
};

require.paths = [];
require.modules = {};
require.cache = {};
require.extensions = [".js",".coffee",".json"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        cwd = path.resolve('/', cwd);
        var y = cwd || '/';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            x = path.normalize(x);
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = path.normalize(x + '/package.json');
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = (Object.keys || function (obj) {
        var res = [];
        for (var key in obj) res.push(key);
        return res;
    })(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

(function () {
    var process = {};
    
    require.define = function (filename, fn) {
        if (require.modules.__browserify_process) {
            process = require.modules.__browserify_process();
        }
        
        var dirname = require._core[filename]
            ? ''
            : require.modules.path().dirname(filename)
        ;
        
        var require_ = function (file) {
            var requiredModule = require(file, dirname);
            var cached = require.cache[require.resolve(file, dirname)];

            if (cached && cached.parent === null) {
                cached.parent = module_;
            }

            return requiredModule;
        };
        require_.resolve = function (name) {
            return require.resolve(name, dirname);
        };
        require_.modules = require.modules;
        require_.define = require.define;
        require_.cache = require.cache;
        var module_ = {
            id : filename,
            filename: filename,
            exports : {},
            loaded : false,
            parent: null
        };
        
        require.modules[filename] = function () {
            require.cache[filename] = module_;
            fn.call(
                module_.exports,
                require_,
                module_,
                module_.exports,
                dirname,
                filename,
                process
            );
            module_.loaded = true;
            return module_.exports;
        };
    };
})();


require.define("path",function(require,module,exports,__dirname,__filename,process){function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

});

require.define("__browserify_process",function(require,module,exports,__dirname,__filename,process){var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
        && window.setImmediate;
    var canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return window.setImmediate;
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'browserify-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('browserify-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    if (name === 'evals') return (require)('vm')
    else throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    process.cwd = function () { return cwd };
    process.chdir = function (dir) {
        if (!path) path = require('path');
        cwd = path.resolve(dir, cwd);
    };
})();

});

require.define("/calc.js",function(require,module,exports,__dirname,__filename,process){// calculate totals of what I ate
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


});

require.define("/calcExtra.js",function(require,module,exports,__dirname,__filename,process){// calculate totals of extra food
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


});

require.define("/roundTotal.js",function(require,module,exports,__dirname,__filename,process){// round float numbers into int
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


});

require.define("/calc.js",function(require,module,exports,__dirname,__filename,process){// calculate totals of what I ate
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


});
require("/calc.js");

require.define("/calcExtra.js",function(require,module,exports,__dirname,__filename,process){// calculate totals of extra food
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


});
require("/calcExtra.js");

require.define("/controllers.js",function(require,module,exports,__dirname,__filename,process){'use strict';

/* Controllers */

// function FoodCtrl($scope, $http, $cookies) {
angular.module('calApp').controller('FoodCtrl', function($scope, $http, $cookies) {
  var calcTotal = require('./calc.js');
  var calcExtraTotal = require('./calcExtra.js');
  var roundTotal = require('./roundTotal.js');

  initState($scope, $cookies);

  // comment when online
  getUser('test@gmail.com', $scope, $http);

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
    // $scope.addButton = false;
    if ($scope.showAdd) {
      $scope.addIcon = 'icon-plus';
      $scope.showAdd = false;
    } else {
      $scope.addIcon = 'icon-minus';
      $scope.showAdd = true;
    }
  };

  $scope.editFood = function() {
    if($scope.editBtnText === 'Edit Food') {
      $scope.availableFoodClass = 'btn';
      $scope.editBtnText = 'Save Food';
      $scope.editBtnClass = 'save';
    } else {
      $scope.availableFoodClass = 'btn edit';
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
    navigator.id.get(gotAssertion);  
    return false; 
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

    addEatenFoodToDB($http, $scope.eaten, $scope.total);
    updateTitle($scope.roundedTotal.calories);
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
        if(data.total !== undefined) {
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
    document.title = 'Y U NO BIG ?' + ' ' + calories;
  };
});

});
require("/controllers.js");
})();
