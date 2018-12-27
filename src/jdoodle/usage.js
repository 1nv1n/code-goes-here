const reqPromise = require("request-promise");
const constants = require("./../constants/constants");
const apiConstants = require("./apiConstants");
const jDoodleCredentials = require("./credentials");

module.exports = {
  jDoodleCreditSpent: function jDoodleCreditSpent() {
    const inputParam = {
      clientId: jDoodleCredentials.CLIENT_ID,
      clientSecret: jDoodleCredentials.CLIENT_SECRET,
    };

    const options = {
      url: apiConstants.v1 + apiConstants.creditSpent,
      method: constants.HTTP_POST,
      json: inputParam,
    };

    return reqPromise(options);
  },
};
