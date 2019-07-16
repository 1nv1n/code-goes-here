/**
 * Return the value by poperty name.
 * @param {String} name
 * @param {String} value
 */
function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true,
  });
}

// JDoodle API
define("v1", "https://api.jdoodle.com/v1");
define("execute", "/execute");
define("creditSpent", "/credit-spent");
