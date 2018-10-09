import {
  app, ipcMain, dialog, screen, BrowserWindow,
} from "electron";
import { enableLiveReload } from "electron-compile";

enableLiveReload();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) { // eslint-disable-line global-require
  app.quit();
}

// JS Imports
const compileJS = require("./jdoodle/compile");
const gHRetrieveJS = require("./github/gHRetrieve");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame: false,
    height: screen.getPrimaryDisplay().workAreaSize.height - 50,
    show: false,
    titleBarStyle: "hidden",
    toolbar: false,
    width: screen.getPrimaryDisplay().workAreaSize.width - 50,
  });

  // And load the main HTML of the app.
  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // Disable the menu
  mainWindow.setMenu(null);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("execute-code", (event, editorText, language, versionIdx) => {
  const compilePromise = compileJS.jDoodleCompile(editorText, language, versionIdx);
  const messageBoxProp = {
    type: "info",
    buttons: ["Cool"],
    title: "Compiler Output",
    message: "",
    detail: "",
  };

  compilePromise.then((result) => {
    messageBoxProp.message = `Status Code: ${result.statusCode}. Memory: ${result.memory}. CPU Time: ${result.cpuTime}. Output: ${result.output}`;
    dialog.showMessageBox(messageBoxProp);
    mainWindow.webContents.send("compiled", 1);
  }, (err) => {
    messageBoxProp.message = JSON.stringify(err);
    messageBoxProp.buttons = ["Well, okay then..."];
    dialog.showMessageBox(messageBoxProp);
    mainWindow.webContents.send("compiled", 0);
  });
});

ipcMain.on("download", (event, descLink, solutionLink) => {
  Promise.all([gHRetrieveJS.retrieveContent(descLink), gHRetrieveJS.retrieveContent(solutionLink)]).then((values) => {
    mainWindow.webContents.send("downloaded", values);
  });
});
