export class Repository {
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

  setRepoUser(repoUser) {
    this.repoUser = repoUser;
  }

  getRepoUser() {
    return this.repoUser;
  }

  setRepoName(repoName) {
    this.repoName = repoName;
  }

  getRepoName() {
    return this.repoName;
  }

  setBranchRef(branchRef) {
    this.branchRef = branchRef;
  }

  getBranchRef() {
    return this.branchRef;
  }

  setDescPath(descPath) {
    this.descPath = descPath;
  }

  getDescPath() {
    return this.descPath;
  }

  setSolPath(solPath) {
    this.solPath = solPath;
  }

  getSolPath() {
    return this.solPath;
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
