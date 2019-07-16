/**
 * Class that represents the user's preferences.
 */
class Preference {
  constructor() {
    this.jDoodleClientID = "";
    this.jDoodleClientSecret = "";
    this.gitHubToken = "";
    this.leetCodeUsername = "";
    this.leetCodePassword = "";
  }

  clearContents() {
    this.jDoodleClientID = "";
    this.jDoodleClientSecret = "";
    this.gitHubToken = "";
    this.leetCodeUsername = "";
    this.leetCodePassword = "";
  }
}

export default {
  Preference,
};
