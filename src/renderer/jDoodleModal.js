/** JDoodle Functions */

/**
 * Send code to the main process to be executed.
 * @param {String} editorText
 * @param {String} language
 * @param {String} versionIdx
 */
function sendCodeToMainProcess(editorText, language, versionIdx) {
  _globalIPCRenderer.send("execute-code", editorText, language, versionIdx);
}

/**
 * Check credit usage.
 */
function checkJDoodleUsage() {
  document.getElementById("jDoodleUsageButton").classList.add("is-loading");
  _globalIPCRenderer.send("check-usage");
}

/**
 * Toggles the enabled/disabled state of the buttons related to JDoodle.
 */
function toggleJDoodleButtons() {
  if (_globalPref.jDoodleClientSecret.length > 0 && _globalPref.jDoodleClientID.length > 0) {
    document.getElementById("jDoodleLangButton").disabled = false;
    document.getElementById("jDoodleUsageButton").disabled = false;
    document.getElementById("jDoodleExecuteButton").disabled = false;
  } else {
    document.getElementById("jDoodleLangButton").disabled = true;
    document.getElementById("jDoodleUsageButton").disabled = true;
    document.getElementById("jDoodleExecuteButton").disabled = true;
  }
}
