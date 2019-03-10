/** LeetCode Functions */

module.exports = {
  /**
  * Toggles the enabled/disabled state of the buttons related to LeetCode.
  */
  toggleLeetCodeButtons: function toggleLeetCodeButtons() {
    if (_globalPref.leetCodeUsername.length > 0 && _globalPref.leetCodePassword.length > 0) {
      document.getElementById("lCodeListButton").disabled = false;
      document.getElementById("lCodeLogOutButton").disabled = false;
    } else {
      document.getElementById("lCodeListButton").disabled = true;
      document.getElementById("lCodeSubmitButton").disabled = true;
      document.getElementById("lCodeLogOutButton").disabled = true;
    }
  },
  leetCodeClearCache: function leetCodeClearCache() {
    _globalIPCRenderer.send("leetcode-command", "cache -d");
  },
  postModalLaunchSteps: function postModalLaunchSteps() {
    document.getElementById("leetCodeLogStatusControl").classList.add("is-loading");
    document.getElementById("leetCodeStatsControl").classList.add("is-loading");
  },
  clearLCModalContent: function clearLCModalContent() {
    document.getElementById("leetCodeLogStatus").value = "";
    document.getElementById("leetCodeStats").value = "";
  },
};
