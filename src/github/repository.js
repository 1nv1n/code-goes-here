/**
 * Class that represents a GitHub repository.
 */
class Repository {
  constructor(repoUser, repoName) {
    this.repoUser = (repoUser === undefined) ? "" : repoUser;
    this.repoName = (repoName === undefined) ? "" : repoName;
    this.branchRef = "";
    this.descPath = "";
    this.solPath = "";
    this.dirPath = [];
  }

  clearContents() {
    this.repoUser = "";
    this.repoName = "";
    this.branchRef = "";
    this.descPath = "";
    this.solPath = "";
    this.dirPath = [];
  }

  clearDirPath() {
    this.dirPath = [];
  }
}

export default {
  Repository,
};
