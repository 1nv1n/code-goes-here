import { ipcRenderer } from "electron";

const { BrowserWindow } = require("electron").remote;

// Is App Maximized
let isAppMaximized = false;

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
 * Download provided problem & solution.
 */
function download() {
  document.getElementById("downloadButton").classList.add("is-loading");

  const probDescLink = document.getElementById("probDescInput").value;
  const solutionLink = document.getElementById("solutionInput").value;

  ipcRenderer.send("download", probDescLink, solutionLink);
}

/**
 * Launch the download modal
 */
function launchDownloadModal() {
  document.getElementById("downloadModal").classList.add("is-active");
  document.documentElement.classList.add("is-clipped");
}

/**
 * Close the download modal
 */
function closeDownloadModal() {
  document.getElementById("downloadModal").classList.remove("is-active");
  document.documentElement.classList.remove("is-clipped");
}

/**
 * Send code to the main process to be executed.
 * @param {String} editorText
 * @param {String} language
 * @param {String} versionIdx
 */
function sendCodeToMainProcess(editorText, language, versionIdx) {
  ipcRenderer.send("execute-code", editorText, language, versionIdx);
}

/**
 * Handle the "compiled" event.
 */
ipcRenderer.on("compiled", (event, code) => {
  document.getElementById("executeCodeButton").classList.remove("is-loading");
});

/**
 * Handle the "downloaded" event.
 */
ipcRenderer.on("downloaded", (event, values) => {
  document.getElementById("downloadButton").classList.remove("is-loading");

  if (values[0] !== null && values[0].length > 0) {
    updateDesc(values[0]);
  }
  if (values[1] !== null && values[1].length > 0) {
    updateCode(values[1]);
  }

  closeDownloadModal();
});
