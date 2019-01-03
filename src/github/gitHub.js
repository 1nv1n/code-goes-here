const reqPromise = require("request-promise");
const constants = require("./../constants/constants");

module.exports = {
  retrieveContent: function retrieveContent(url) {
    if (url === null || url.length <= 0) {
      return "";
    }

    const options = {
      url: url,
      method: constants.HTTP_GET,
    };

    return reqPromise(options);
  },
  retrieveUser: function retrieveUser(user) {
    return new Promise((resolve, reject) => {
      user.getProfile((err, profile) => {
        if (err === null || err === undefined) {
          resolve(profile);
        } else {
          reject(err);
        }
      });
    });
  },
  retrieveEmailList: function retrieveEmailList(user) {
    return new Promise((resolve, reject) => {
      user.getEmails((err, emaiList) => {
        if (err === null || err === undefined) {
          resolve(emaiList);
        } else {
          reject(err);
        }
      });
    });
  },
  writeFile: function writeFile(repository, branchRef, path, fileContent, commitMessage, options) {
    return new Promise((resolve, reject) => {
      repository.writeFile(branchRef, path, fileContent, commitMessage, options, (err, response) => {
        if (err === null || err === undefined) {
          resolve(response.commit.sha);
        } else {
          reject(err);
        }
      });
    });
  },
};
