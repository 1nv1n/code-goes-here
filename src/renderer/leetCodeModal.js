/** LeetCode Functions */

module.exports = {
  /**
  * Toggles the enabled/disabled state of the buttons related to LeetCode.
  */
  toggleLeetCodeButtons: function toggleLeetCodeButtons() {
    if (_globalPref.leetCodeUsername.length > 0 && _globalPref.leetCodePassword.length > 0) {
      document.getElementById("lCodeListButton").disabled = false;
      document.getElementById("lCodeStatButton").disabled = false;
      document.getElementById("lCodeSubmitButton").disabled = false;
      document.getElementById("lCodeLogOutButton").disabled = false;
    } else {
      document.getElementById("lCodeListButton").disabled = true;
      document.getElementById("lCodeStatButton").disabled = true;
      document.getElementById("lCodeSubmitButton").disabled = true;
      document.getElementById("lCodeLogOutButton").disabled = true;
    }
  },
  getLeetCodeCLIVersion: function getLeetCodeCLIVersion() {
    _globalIPCRenderer.send("leetcode-command", "version");
  },
  listLeetCodeProblems: function listLeetCodeProblems() {
    _globalIPCRenderer.send("leetcode-command", "list");
  },
  leetCodeLogOut: function leetCodeLogOut() {
    _globalIPCRenderer.send("leetcode-command", "user -L");
  },
  leetCodeClearCache: function leetCodeClearCache() {
    _globalIPCRenderer.send("leetcode-command", "cache -d");
  },
};
