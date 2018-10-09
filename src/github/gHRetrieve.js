const reqPromise = require("request-promise");
const constants = require("./../constants/constants");

module.exports = {
  retrieveContent: function jDoodleCompile(url) {
    if (url === null || url.length <= 0) {
      return "";
    }

    const options = {
      url: url,
      method: constants.HTTP_GET,
    };

    return reqPromise(options);
  },
};
