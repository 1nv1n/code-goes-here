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
 * Handle the "compiled" event.
 */
ipcRenderer.on("compiled", (event, code) => {
  document.getElementById("executeCodeButton").classList.remove("is-loading");
});

/**
 * Send code to the main process to be executed.
 * @param {String} editorText
 * @param {String} language
 * @param {String} versionIdx
 */
function sendCodeToMainProcess(editorText, language, versionIdx) {
  ipcRenderer.send("execute-code", editorText, language, versionIdx);
}
