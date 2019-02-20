const reqPromise = require("request-promise");
const constants = require("../constants/constants");
const apiConstants = require("./apiConstants");

module.exports = {
  execute: function execute(editorText, language, versionIdx, pref) {
    const program = {
      script: editorText,
      language: language,
      versionIndex: versionIdx,
      clientId: pref.jDoodleClientID,
      clientSecret: pref.jDoodleClientSecret,
    };

    const options = {
      url: apiConstants.v1 + apiConstants.execute,
      method: constants.HTTP_POST,
      json: program,
    };

    return reqPromise(options);
  },
  checkSpentCredit: function checkSpentCredit(pref) {
    const inputParam = {
      clientId: pref.jDoodleClientID,
      clientSecret: pref.jDoodleClientSecret,
    };

    const options = {
      url: apiConstants.v1 + apiConstants.creditSpent,
      method: constants.HTTP_POST,
      json: inputParam,
    };

    return reqPromise(options);
  },
};
