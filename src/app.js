import {
  app, ipcMain, dialog, screen, BrowserWindow,
} from "electron";
import { enableLiveReload } from "electron-compile";
import { exec } from "child_process";

enableLiveReload();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) { // eslint-disable-line global-require
  app.quit();
}

const fileSystem = require("fs");
const settings = require("electron-settings");
const prefManagerJS = require("./preferences/preferenceManager");
const jDoodleJS = require("./jdoodle/jDoodle");
const gitHubJS = require("./github/gitHub");
const leetCodeJS = require("./leetcode/leetCode");
const cliConstants = require("./leetcode/cliConstants");

const lCodeBaseCommand = "leetcode ";

let repository;
let pref;
let gitHub;
let gHUser;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const mainWindowReady = () => {
  mainWindow.webContents.send("main-window-ready", pref);
};

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

  // Open DevTools on launch.
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

  mainWindow.webContents.on("did-finish-load", mainWindowReady);
};

async function initiateWindowLoad() {
  pref = await prefManagerJS.readCurrentPref(settings);
  gitHub = await gitHubJS.createInstance(pref);
  gHUser = gitHub.getUser();

  createWindow();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", initiateWindowLoad);

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

ipcMain.on("save-pref", (event, updatedPref) => {
  pref = updatedPref;
  prefManagerJS.updatePref(settings, pref);
});

ipcMain.on("execute-code", (event, editorText, language, versionIdx) => {
  const compilePromise = jDoodleJS.execute(editorText, language, versionIdx, pref);
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
    mainWindow.webContents.send("compiled", 0);
  }, (err) => {
    messageBoxProp.message = JSON.stringify(err);
    messageBoxProp.buttons = ["Well, okay then..."];
    dialog.showMessageBox(messageBoxProp);
    mainWindow.webContents.send("compiled", 1);
  });
});

ipcMain.on("check-usage", (event) => {
  const usageCheckPromise = jDoodleJS.checkSpentCredit(pref);
  const messageBoxProp = {
    type: "info",
    buttons: ["Cool"],
    title: "Usage",
    message: "",
    detail: "",
  };

  usageCheckPromise.then((result) => {
    messageBoxProp.message = `Used: ${result.used} Credit(s).`;
    dialog.showMessageBox(messageBoxProp);
    mainWindow.webContents.send("usage-checked", 0);
  }, (err) => {
    messageBoxProp.message = JSON.stringify(err);
    messageBoxProp.buttons = ["Well, okay then..."];
    dialog.showMessageBox(messageBoxProp);
    mainWindow.webContents.send("usage-checked", 1);
  });
});

ipcMain.on("download", (event, descLink, solutionLink) => {
  Promise.all([gitHubJS.retrieveContent(descLink), gitHubJS.retrieveContent(solutionLink)]).then((values) => {
    mainWindow.webContents.send("downloaded", values);
  });
});

ipcMain.on("set-desc-local", (event) => {
  fileSystem.readFile(`${__dirname}/template/Template.md`, "utf8", (err, data) => {
    mainWindow.webContents.send("desc-template", data);
  });
});

ipcMain.on("set-sol-local", (event, solLangFlag) => {
  const path = (solLangFlag === 1) ? `${__dirname}/template/Solution.java` : `${__dirname}/template/Template`;
  fileSystem.readFile(path, "utf8", (err, data) => {
    mainWindow.webContents.send("sol-template", data);
  });
});

ipcMain.on("save-local", (event, descTxt, solTxt) => {
  const options = {
    title: "Save Readme (Problem Description)",
    defaultPath: app.getPath("documents").concat("/README.md"),
  };

  const messageBoxProp = {
    type: "info",
    buttons: ["OK"],
    title: "Error",
    message: "Failed To Save",
    detail: "err",
  };

  dialog.showSaveDialog(null, options, (path) => {
    try {
      fileSystem.writeFileSync(path, descTxt, "utf-8");
    } catch (err) {
      messageBoxProp.detail = JSON.stringify(err);
      dialog.showMessageBox(messageBoxProp);
    }
  });

  options.title = "Save Solution Code";
  options.defaultPath = app.getPath("documents").concat("/Solution");
  dialog.showSaveDialog(null, options, (path) => {
    try {
      fileSystem.writeFileSync(path, solTxt, "utf-8");
    } catch (err) {
      messageBoxProp.detail = JSON.stringify(err);
      dialog.showMessageBox(messageBoxProp);
    }
  });
});

ipcMain.on("list-repos", (event) => {
  gHUser.listRepos((err, repoList) => {
    mainWindow.webContents.send("repos-list", repoList);
  });
});

ipcMain.on("get-repo", (event, repoUser, repoName) => {
  repository = gitHub.getRepo(repoUser, repoName);
  repository.listBranches((err, branchList) => {
    mainWindow.webContents.send("branch-list", branchList);
  });
});

ipcMain.on("get-branch", (event, ref) => {
  repository.getContents(ref, "", false, (err, contentArr) => {
    contentArr.sort(createComparator());
    mainWindow.webContents.send("branch-contents", contentArr);
  });
});

ipcMain.on("get-dir", (event, repoInfo) => {
  let dirPath = "";
  repoInfo.dirPath.forEach((dir) => {
    dirPath += dir;
    dirPath += "/";
  });
  repository.getContents(repoInfo.branchRef, dirPath, false, (err, contentArr) => {
    contentArr.sort(createComparator());
    mainWindow.webContents.send("dir-contents", contentArr);
  });
});

ipcMain.on("get-desc", (event, descLink) => {
  Promise.all([gitHubJS.retrieveContent(descLink)]).then((content) => {
    mainWindow.webContents.send("got-desc", content);
  });
});

ipcMain.on("get-sol", (event, solLink) => {
  Promise.all([gitHubJS.retrieveContent(solLink)]).then((content) => {
    mainWindow.webContents.send("got-sol", content);
  });
});

ipcMain.on("commit-github", (event, repoInfo, descTxt, solTxt, commitMessage) => {
  const user = gitHub.getUser();
  const cGHCommitMessage = `CGH - ${commitMessage}`;
  Promise.all([gitHubJS.retrieveUser(user), gitHubJS.retrieveEmailList(user)]).then((values) => {
    const options = {
      author: {
        name: values[0].name,
        email: values[1][0].email,
      },
      committer: {
        name: values[0].name,
        email: values[1][0].email,
      },
      encode: true,
    };

    repository = gitHub.getRepo(repoInfo.repoUser, repoInfo.repoName);
    Promise.all([gitHubJS.writeFile(repository, repoInfo.branchRef, repoInfo.descPath, descTxt, cGHCommitMessage, options)]).then((descCommit) => {
      Promise.all([gitHubJS.writeFile(repository, repoInfo.branchRef, repoInfo.solPath, solTxt, cGHCommitMessage, options)]).then((solCommit) => {
        mainWindow.webContents.send("committed", descCommit, solCommit);
      });
    });
  });
});

ipcMain.on("leetcode-version", (event) => {
  leetCodeJS.leetCodeExec(exec, lCodeBaseCommand.concat("version"), (stdout, stderr) => {
    mainWindow.webContents.send("leetcode-version", stdout, stderr);
  });
});

ipcMain.on("leetcode-user", (event) => {
  leetCodeJS.leetCodeExec(exec, lCodeBaseCommand.concat("user"), (stdout) => {
    if (stdout.includes(cliConstants.NOT_LOGGED_IN_ERROR)) {
      if (pref.leetCodeUsername.length > 0 && pref.leetCodePassword.length > 0) {
        leetCodeJS.leetCodeLogin(exec, pref, (stdOut1) => {
          mainWindow.webContents.send("leetcode-user-logged-in", stdOut1);

          leetCodeJS.leetCodeExec(exec, lCodeBaseCommand.concat("stat"), (stdStat) => {
            mainWindow.webContents.send("leetcode-stat", stdStat);
          });

          leetCodeJS.leetCodeExec(exec, lCodeBaseCommand.concat("list"), (stdList) => {
            mainWindow.webContents.send("leetcode-list", stdList);
          });
        });
      } else {
        mainWindow.webContents.send("leetcode-user", cliConstants.NOT_LOGGED_IN_NO_CRED);
      }
    } else if (stdout.includes(cliConstants.LOGGED_IN_USER)) {
      mainWindow.webContents.send("leetcode-user", stdout);

      leetCodeJS.leetCodeExec(exec, lCodeBaseCommand.concat("stat"), (stdStat) => {
        mainWindow.webContents.send("leetcode-stat", stdStat);
      });

      leetCodeJS.leetCodeExec(exec, lCodeBaseCommand.concat("list"), (stdList) => {
        mainWindow.webContents.send("leetcode-list", stdList);
      });
    }
  });
});

ipcMain.on("leetcode-logout", (event) => {
  leetCodeJS.leetCodeExec(exec, lCodeBaseCommand.concat("user -L"), (stdout, stderr) => {
    mainWindow.webContents.send("leetcode-logout", stdout, stderr);
  });
});

ipcMain.on("leetcode-command", (event, command) => {
  leetCodeJS.leetCodeExec(exec, lCodeBaseCommand.concat(command), (stdout, stderr) => {
    mainWindow.webContents.send("leetcode", command, stdout, stderr);
  });
});

/**
 * A comparator to sort files & directories by name.
 * Intended for the Repository.getContents response.
 */
function createComparator() {
  return function sortByName(a, b) {
    const nameA = a.name.trim().toLowerCase();
    const nameB = b.name.trim().toLowerCase();

    if (nameA < nameB) {
      return -1;
    }

    if (nameA > nameB) {
      return 1;
    }

    return 0;
  };
}
