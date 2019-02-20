export class Preference {
  constructor() {
    this.jDoodleClientID = "";
    this.jDoodleClientSecret = "";
    this.gitHubToken = "";
  }

  clearContents() {
    this.jDoodleClientID = "";
    this.jDoodleClientSecret = "";
    this.gitHubToken = "";
  }
}
