export class Repository {
  constructor(repoUser, repoName) {
    this.repoUser = (repoUser === undefined) ? "" : repoUser;
    this.repoName = (repoName === undefined) ? "" : repoName;
    this.branchRef = "";
    this.dirPath = [];
  }

  setRepoUser(repoUser) {
    this.repoUser = repoUser;
  }

  getRepoUser() {
    return this.repoUser;
  }

  setRepoName(repoName) {
    this.repoName = repoName;
  }

  geRepoName() {
    return this.repoName;
  }

  setBranchRef(branchRef) {
    this.branchRef = branchRef;
  }

  getBranchRef() {
    return this.branchRef;
  }

  addDirToPath(dir) {
    this.dirPath.push(dir);
  }

  getDirPath() {
    return this.dirPath;
  }

  clearDirPath() {
    this.dirPath = [];
  }
}
