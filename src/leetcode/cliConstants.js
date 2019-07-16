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

// LeetCode-CLI Constants
define("NOT_LOGGED_IN_ERROR", "[ERROR] You are not login yet");
define("NOT_LOGGED_IN_NO_CRED", "Not logged in, no credentials provided");
define("LOGGED_IN_USER", "Premium");
