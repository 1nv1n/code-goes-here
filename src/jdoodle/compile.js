const reqPromise = require("request-promise");
const apiConstants = require("./apiConstants");
const jDoodleCredentials = require("./credentials");

module.exports = {
  jDoodleCompile: function jDoodleCompile(editorText, language, versionIdx) {
    const program = {
      script: editorText,
      language: language,
      versionIndex: versionIdx,
      clientId: jDoodleCredentials.CLIENT_ID,
      clientSecret: jDoodleCredentials.CLIENT_SECRET,
    };

    const options = {
      url: apiConstants.API,
      method: apiConstants.HTTP_POST,
      json: program,
    };

    return reqPromise(options);
  },
};
