const GitHubInstance = require("github-api");

const reqPromise = require("request-promise");
const constants = require("../constants/constants");

module.exports = {
  createInstance: function createInstance(pref) {
    return new Promise((resolve, reject) => {
      let gitHub;
      if (pref.gitHubToken.length > 0) {
        gitHub = new GitHubInstance({
          token: pref.gitHubToken,
        });
        resolve(gitHub);
      } else {
        reject(gitHub);
      }
    });
  },
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
  /**
   * A comparator to sort files & directories by name.
   * Intended for the Repository.getContents response.
   */
  createRepoComparator: function createRepoComparator() {
    return function sortByName(a, b) {
      const nameA = a.name.trim().toLowerCase();
      const nameB = b.name.trim().toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    };
  },
};
