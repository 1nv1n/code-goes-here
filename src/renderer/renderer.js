import { ipcRenderer } from "electron";
import { Repository } from "./github/repository";
import { Preference } from "./preferences/preference";

const { BrowserWindow } = require("electron").remote;

const _globalIPCRenderer = ipcRenderer;
const _globalRepoInfo = new Repository();
const _globalPref = new Preference();
const _globalCommonJS = require("./renderer/common");
const _globalLeetCodeJS = require("./renderer/leetCodeModal");

let isAppMaximized = false;
let _globalIsInDownLoadMode = true;

/**
 * Minimize the App.
 */
function minimizeApp() {
  BrowserWindow.getFocusedWindow().minimize();
}

/**
 * Maximize the App.
 */
function maximizeApp() {
  if (isAppMaximized) {
    isAppMaximized = false;
    BrowserWindow.getFocusedWindow().restore();
  } else {
    isAppMaximized = true;
    BrowserWindow.getFocusedWindow().maximize();
  }
}

/**
 * Close the App.
 */
function closeApp() {
  BrowserWindow.getFocusedWindow().close();
}

/**
 * Set the local defaults (description & solution) to the editors.
 */
function setLocalDefault() {
  document.getElementById("setLocalDefBtn").classList.add("is-loading");
  _globalIPCRenderer.send("set-desc-local");
  _globalIPCRenderer.send("set-sol-local", 1);
}

/**
 * Set the remote defaults (description & solution) to the editors.
 * TODO: Make this configurable.
 */
function setRemoteDefault() {
  _globalIPCRenderer.send("download", "https://raw.githubusercontent.com/1nv1n/ProgrammingFundamentals/master/Template/README.md", "https://raw.githubusercontent.com/1nv1n/ProgrammingFundamentals/master/Template/Solution.java");
}

/**
 * Download provided problem & solution.
 */
function downloadContent() {
  document.getElementById("downloadContentButton").classList.add("is-loading");
  _globalIPCRenderer.send("download", document.getElementById("descDownloadInput").value, document.getElementById("codeDownloadInput").value);
}

/**
 * Save Description & Solution locally.
 */
function saveLocal() {
  _globalIPCRenderer.send("save-local", descEditor.getValue(), codeEditor.getValue());
}

/**
 * Get the content of the description from the provided URL.
 * @param {String} downloadURL
 */
function getDescriptionContent(downloadURL) {
  _globalIPCRenderer.send("get-desc", downloadURL);
}

/**
 * Get the content of the solution from the provided URL.
 * @param {String} downloadURL
 */
function getSolutionContent(downloadURL) {
  _globalIPCRenderer.send("get-sol", downloadURL);
}

/**
 * Handle the "main-window-ready" event.
 */
_globalIPCRenderer.on("main-window-ready", (event, savedPref) => {
  setCurrentPref(savedPref);
  toggleJDoodleButtons();
  toggleGitHubButtons();
  _globalLeetCodeJS.toggleLeetCodeButtons();
  setLocalPref();
});

/**
 * Launch the LeetCode Modal
 */
function launchLeetCodeModal() {
  _globalIPCRenderer.send("leetcode-version");
  _globalIPCRenderer.send("leetcode-user");
  document.getElementById("leetCodeModal").classList.add("is-active");
  document.documentElement.classList.add("is-clipped");
}

/**
 * Close the LeetCode modal
 */
function closeLeetCodeModal() {
  document.getElementById("leetCodeModal").classList.remove("is-active");
  document.documentElement.classList.remove("is-clipped");
}

/**
 * Log out of LeetCode.
 */
function leetCodeLogOut() {
  document.getElementById("logoutLeetCodeButton").classList.add("is-loading");
  _globalIPCRenderer.send("leetcode-logout");
}

/**
 * Handle the "compiled" event.
 */
_globalIPCRenderer.on("compiled", (event, code) => {
  document.getElementById("jDoodleExecuteButton").classList.remove("is-loading");
});

/**
 * Handle the "downloaded" event.
 */
_globalIPCRenderer.on("downloaded", (event, values) => {
  document.getElementById("downloadContentButton").classList.remove("is-loading");

  if (values[0] !== null && values[0].length > 0) {
    updateDesc(values[0]);
  }
  if (values[1] !== null && values[1].length > 0) {
    updateCode(values[1]);
  }

  closeDownloadModal();
});

/**
 * Handle the "check-usage" event.
 */
_globalIPCRenderer.on("usage-checked", (event, code) => {
  document.getElementById("jDoodleUsageButton").classList.remove("is-loading");
});

/**
 * Handle the description template recieved event.
 */
_globalIPCRenderer.on("desc-template", (event, desc) => {
  if (document.getElementById("setLocalDefBtn").classList.contains("is-loading")) {
    document.getElementById("setLocalDefBtn").classList.remove("is-loading");
  }
  descEditor.setValue(desc);
});

/**
 * Handle the solution template recieved event.
 */
_globalIPCRenderer.on("sol-template", (event, code) => {
  if (document.getElementById("setLocalDefBtn").classList.contains("is-loading")) {
    document.getElementById("setLocalDefBtn").classList.remove("is-loading");
  }
  codeEditor.setValue(code);
});

/**
 * Handle the receipt of the list of the repositories associated to the currently authenticated user.
 */
_globalIPCRenderer.on("repos-list", (event, repoList) => {
  populateReposList(repoList);
});

/**
 * Handle the receipt of the list of the selected respository"s branches.
 */
_globalIPCRenderer.on("branch-list", (event, branchList) => {
  populateBranchList(branchList);
});

/**
 * Handle the receipt of the branch content.
 */
_globalIPCRenderer.on("branch-contents", (event, contentList) => {
  populateContentList(contentList);
});

/**
 * Handle the receipt of the directory content.
 */
_globalIPCRenderer.on("dir-contents", (event, contentList) => {
  populateContentList(contentList);
});

/**
 * Handle the description downloaded event.
 */
_globalIPCRenderer.on("got-desc", (event, content) => {
  if (content[0] !== null && content[0].length > 0) {
    updateDesc(content[0]);
  }
});

/**
 * Handle the solution downloaded event.
 */
_globalIPCRenderer.on("got-sol", (event, content) => {
  if (content[0] !== null && content[0].length > 0) {
    updateCode(content[0]);
  }
});

/**
 * Handle the commit event.
 */
_globalIPCRenderer.on("committed", (event, descCommit, solCommit) => {
  setCommitToModal(descCommit, solCommit);
});

/**
 * Handle the LeetCode CLI version response.
 */
_globalIPCRenderer.on("leetcode-version", (event, stdout) => {
  if (document.getElementById("leetCodeVersionControl").classList.contains("is-loading")) {
    document.getElementById("leetCodeVersionControl").classList.remove("is-loading");
  }
  document.getElementById("leetCodeVersion").value = `Version ${stdout}`;
});

/**
 * Handle the LeetCode CLI user response.
 */
_globalIPCRenderer.on("leetcode-user-logged-in", (event, stdout) => {
  if (document.getElementById("leetCodeLogStatusControl").classList.contains("is-loading")) {
    document.getElementById("leetCodeLogStatusControl").classList.remove("is-loading");
  }
  document.getElementById("leetCodeLogStatus").value = stdout;
  document.getElementById("logoutLeetCodeButton").disabled = false;
});

/**
 * Handle the LeetCode CLI user response.
 */
_globalIPCRenderer.on("leetcode-user", (event, stdout) => {
  console.log(stdout);
  if (document.getElementById("leetCodeLogStatusControl").classList.contains("is-loading")) {
    document.getElementById("leetCodeLogStatusControl").classList.remove("is-loading");
  }
  document.getElementById("leetCodeLogStatus").value = stdout.trim();
});

/**
 * Handle the LeetCode CLI version response.
 */
_globalIPCRenderer.on("leetcode-logout", (event, stdout) => {
  if (document.getElementById("logoutLeetCodeButton").classList.contains("is-loading")) {
    document.getElementById("logoutLeetCodeButton").classList.remove("is-loading");
  }
  document.getElementById("logoutLeetCodeButton").disabled = true;
  document.getElementById("leetCodeLogStatus").value = stdout.trim();
});

/**
 * Handle the LeetCode CLI user response.
 */
_globalIPCRenderer.on("leetcode-stat", (event, stdout) => {
  if (document.getElementById("leetCodeStatsControl").classList.contains("is-loading")) {
    document.getElementById("leetCodeStatsControl").classList.remove("is-loading");
  }
  const stat = stdout.trim();
  document.getElementById("leetCodeStats").value = ` ${stat}`;
});

/**
 * Handle the LeetCode CLI user response.
 */
_globalIPCRenderer.on("leetcode-list", (event, stdout) => {
  if (document.getElementById("leetCodeListControl").classList.contains("is-loading")) {
    document.getElementById("leetCodeListControl").classList.remove("is-loading");
  }
  const formattedList = "";
  const lcList = stdout.split("\n");
  lcList.forEach((problem) => {
    console.log(problem);
    formattedList.concat(problem.trim());
    formattedList.concat("\n");
  });
  console.log(formattedList);
  document.getElementById("leetCodeList").value = stdout;
});


/**
 * Handle the LeetCode CLI user response.
 */
_globalIPCRenderer.on("leetcode", (event, command, stdout, stderr) => {
  console.log(command);
  console.log(stdout);
  console.log(stderr);

  if (command === "version") {
    if (document.getElementById("leetCodeVersionControl").classList.contains("is-loading")) {
      document.getElementById("leetCodeVersionControl").classList.remove("is-loading");
    }
    document.getElementById("leetCodeVersion").value = stdout;
  }
});
