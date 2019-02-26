/** LeetCode Functions */

/**
 * Toggles the enabled/disabled state of the buttons related to LeetCode.
 */
function toggleLeetCodeButtons() {
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
}

function getLeetCodeCLIVersion() {
  _globalIPCRenderer.send("leetcode-command", "version");
}

function listLeetCodeProblems() {
  _globalIPCRenderer.send("leetcode-command", "list");
}

function leetCodeLogOut() {
  _globalIPCRenderer.send("leetcode-command", "user -L");
}

function leetCodeClearCache() {
  _globalIPCRenderer.send("leetcode-command", "cache -d");
}