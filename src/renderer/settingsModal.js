/** Functions for the Settings Modal */

/**
 * Sets the preferences on load.
 * @param {*} savedPref
 */
function setCurrentPref(savedPref) {
  _globalPref.jDoodleClientID = savedPref.jDoodleClientID;
  _globalPref.jDoodleClientSecret = savedPref.jDoodleClientSecret;
  _globalPref.gitHubToken = savedPref.gitHubToken;
  _globalPref.leetCodeUsername = savedPref.leetCodeUsername;
  _globalPref.leetCodePassword = savedPref.leetCodePassword;
}

/**
 * Sets the preference values.
 */
function setLocalPref() {
  document.getElementById("jDoodleClientIDInput").value = _globalPref.jDoodleClientID;
  document.getElementById("jDoodleClientSecretInput").value = _globalPref.jDoodleClientSecret;
  document.getElementById("gitHubTokenInput").value = _globalPref.gitHubToken;
  document.getElementById("leetCodeUserInput").value = _globalPref.leetCodeUsername;
  document.getElementById("leetCodePassInput").value = _globalPref.leetCodePassword;
}

/**
 * Launch the settings modal
 */
function launchSettingsModal() {
  document.getElementById("settingsModal").classList.add("is-active");
  document.documentElement.classList.add("is-clipped");
}

/**
 * Close the settings modal
 */
function closeSettingsModal() {
  document.getElementById("settingsModal").classList.remove("is-active");
  document.documentElement.classList.remove("is-clipped");
}

/**
 * Save settings.
 */
function saveSettings() {
  _globalPref.jDoodleClientID = document.getElementById("jDoodleClientIDInput").value;
  _globalPref.jDoodleClientSecret = document.getElementById("jDoodleClientSecretInput").value;
  _globalPref.gitHubToken = document.getElementById("gitHubTokenInput").value;
  _globalPref.leetCodeUsername = document.getElementById("leetCodeUserInput").value;
  _globalPref.leetCodePassword = document.getElementById("leetCodePassInput").value;

  _globalIPCRenderer.send("save-pref", _globalPref);

  toggleJDoodleButtons();
  toggleGitHubButtons();
  _globalLeetCodeJS.toggleLeetCodeButtons();
  closeSettingsModal();
}

/**
 * Reset settings.
 */
function resetSettings() {
  document.getElementById("jDoodleClientIDInput").value = "";
  document.getElementById("jDoodleClientSecretInput").value = "";
  document.getElementById("gitHubTokenInput").value = "";
  document.getElementById("leetCodeUserInput").value = "";
  document.getElementById("leetCodePassInput").value = "";
}

/**
 * Switch to the "Credentials" tab on the settings modal
 */
function switchToCredTab() {
  if (document.getElementById("prefTab").classList.contains("is-active")) {
    document.getElementById("prefTab").classList.remove("is-active");
  }

  if (!document.getElementById("prefTabContent").classList.contains("is-hidden")) {
    document.getElementById("prefTabContent").classList.add("is-hidden");
  }

  if (!document.getElementById("credTab").classList.contains("is-active")) {
    document.getElementById("credTab").classList.add("is-active");
  }

  if (document.getElementById("credTabContent").classList.contains("is-hidden")) {
    document.getElementById("credTabContent").classList.remove("is-hidden");
  }
}

/**
 * Switch to the "Preferences" tab on the settings modal
 */
function switchToPrefTab() {
  if (document.getElementById("credTab").classList.contains("is-active")) {
    document.getElementById("credTab").classList.remove("is-active");
  }

  if (!document.getElementById("credTabContent").classList.contains("is-hidden")) {
    document.getElementById("credTabContent").classList.add("is-hidden");
  }

  if (!document.getElementById("prefTab").classList.contains("is-active")) {
    document.getElementById("prefTab").classList.add("is-active");
  }

  if (document.getElementById("prefTabContent").classList.contains("is-hidden")) {
    document.getElementById("prefTabContent").classList.remove("is-hidden");
  }
}
