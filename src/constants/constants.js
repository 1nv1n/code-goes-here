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

// App Constants
define("HTTP_GET", "GET");
define("HTTP_POST", "POST");
