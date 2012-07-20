var Browser = require("zombie");
var assert = require("assert");

// Load the page from localhost
browser = new Browser()

browser.visit("http://localhost:3000/", {debug: true}, function () {
  browser.pressButton("+ Add", function() {
    browser.
    fill('input[placeholder="Name"]', "sauce").
    fill('input[placeholder="Calories"]', "100").
      pressButton("Add", function() {
        assert.ok(browser.success);
        assert.equal(browser.text('.total'), "calories 100 protein 0 carbs 0 fat 0");
        console.log(browser.text('.total'));
    });
  });
});
