import { Preference } from "./preference";

module.exports = {
  readCurrentPref: function readCurrentPref(settings) {
    return new Promise((resolve) => {
      const pref = new Preference();

      if (settings.has("jDoodleClientID")) {
        pref.jDoodleClientID = settings.get("jDoodleClientID");
      }

      if (settings.has("jDoodleClientSecret")) {
        pref.jDoodleClientSecret = settings.get("jDoodleClientSecret");
      }

      if (settings.has("gitHubToken")) {
        pref.gitHubToken = settings.get("gitHubToken");
      }

      if (settings.has("leetCodeUsername") && settings.has("leetCodePassword")) {
        pref.leetCodeUsername = settings.get("leetCodeUsername");
        pref.leetCodePassword = settings.get("leetCodePassword");
      }

      resolve(pref);
    });
  },
  updatePref: function updatePref(settings, pref) {
    settings.set("jDoodleClientID", pref.jDoodleClientID);
    settings.set("jDoodleClientSecret", pref.jDoodleClientSecret);
    settings.set("gitHubToken", pref.gitHubToken);
    settings.set("leetCodeUsername", pref.leetCodeUsername);
    settings.set("leetCodePassword", pref.leetCodePassword);
  },
};
