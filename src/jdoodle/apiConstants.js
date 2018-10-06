function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true,
  });
}

// JDoodle Credentials
define("API", "https://api.jdoodle.com/execute");
define("HTTP_POST", "POST");
