import { ipcRenderer } from "electron";
import { Repository } from "./github/repository";

const { BrowserWindow } = require("electron").remote;

const repoInfo = new Repository();

let isAppMaximized = false;
let isInDownLoadMode = true;

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
 * Collapse the description editor column.
 */
function toggleColumnDesc() {
  if (document.getElementById("toggleColumnDesc").value === "min") {
    document.getElementById("descColumn").classList.remove("is-4");
    document.getElementById("descColumn").classList.add("is-hidden-touch");
    document.getElementById("descColumn").classList.add("is-hidden-tablet");
    document.getElementById("descColumn").classList.add("is-hidden-desktop");

    document.getElementById("solColumn").classList.remove("is-8");
    document.getElementById("solColumn").classList.add("is-12");

    document.getElementById("descColMinBtnIcon").classList.remove("fa-minus");
    document.getElementById("descColMinBtnIcon").classList.add("fa-plus");

    document.getElementById("toggleColumnDesc").value = "max";
    document.getElementById("toggleColumnDesc").title = "Maximize Description Column";
  } else {
    document.getElementById("descColumn").classList.add("is-4");
    document.getElementById("descColumn").classList.remove("is-hidden-touch");
    document.getElementById("descColumn").classList.remove("is-hidden-tablet");
    document.getElementById("descColumn").classList.remove("is-hidden-desktop");

    document.getElementById("solColumn").classList.remove("is-12");
    document.getElementById("solColumn").classList.add("is-8");

    document.getElementById("descColMinBtnIcon").classList.add("fa-minus");
    document.getElementById("descColMinBtnIcon").classList.remove("fa-plus");

    document.getElementById("toggleColumnDesc").value = "min";
    document.getElementById("toggleColumnDesc").title = "Minimize Description Column";
  }
}

/**
 * Collapse the code editor column.
 */
function toggleColumnCode() {
  if (document.getElementById("toggleCodeDesc").value === "min") {
    document.getElementById("solColumn").classList.remove("is-8");
    document.getElementById("solColumn").classList.add("is-hidden-touch");
    document.getElementById("solColumn").classList.add("is-hidden-tablet");
    document.getElementById("solColumn").classList.add("is-hidden-desktop");

    document.getElementById("descColumn").classList.remove("is-4");
    document.getElementById("descColumn").classList.add("is-12");

    document.getElementById("codeColMinBtnIcon").classList.remove("fa-minus");
    document.getElementById("codeColMinBtnIcon").classList.add("fa-plus");

    document.getElementById("toggleCodeDesc").value = "max";
    document.getElementById("toggleCodeDesc").title = "Maximize Code Column";
  } else {
    document.getElementById("solColumn").classList.remove("is-hidden-touch");
    document.getElementById("solColumn").classList.remove("is-hidden-tablet");
    document.getElementById("solColumn").classList.remove("is-hidden-desktop");
    document.getElementById("solColumn").classList.add("is-8");

    document.getElementById("descColumn").classList.remove("is-12");
    document.getElementById("descColumn").classList.add("is-4");

    document.getElementById("codeColMinBtnIcon").classList.add("fa-minus");
    document.getElementById("codeColMinBtnIcon").classList.remove("fa-plus");

    document.getElementById("toggleCodeDesc").value = "min";
    document.getElementById("toggleCodeDesc").title = "Minimize Code Column";
  }
}

/**
 * Set the defaults (description & solution) to the editors.
 * TODO: Make this configurable.
 */
function setDefault() {
  ipcRenderer.send("download", "https://raw.githubusercontent.com/1nv1n/ProgrammingFundamentals/master/Template/README.md", "https://raw.githubusercontent.com/1nv1n/ProgrammingFundamentals/master/Template/Solution.java");
}

/**
 * Download provided problem & solution.
 */
function download() {
  document.getElementById("downloadButton").classList.add("is-loading");
  ipcRenderer.send("download", document.getElementById("probDescInput").value, document.getElementById("solutionInput").value);
}

/**
 * Save Description & Solution locally.
 */
function saveLocal() {
  ipcRenderer.send("save-local", descEditor.getValue(), codeEditor.getValue());
}

/**
 * Clear the content of the description editor.
 */
function clearDesc() {
  descEditor.setValue("");
}

/**
 * Clear the content of the solution editor.
 */
function clearSol() {
  codeEditor.setValue("");
}

/**
 * Reset the content of the description editor to the value from the template.
 */
function resetDesc() {
  document.getElementById("resetDescButton").classList.add("is-loading");
  ipcRenderer.send("reset-desc");
}

/**
 * Clear the content of the solution editor to the value from the template.
 */
function resetSol() {
  document.getElementById("resetSolButton").classList.add("is-loading");
  ipcRenderer.send("reset-sol", 1);
}

/**
 * Launch the GitHub Modal to select a directory to commit to.
 */
function launchGitHubRepoModalForCommit() {
  launchGitHubRepoModal();
  isInDownLoadMode = false;
}

/**
 * Launch the GitHub commit modal.
 * @param {String} path
 */
function startGitHubCommit(path) {
  repoInfo.setDescPath(path.concat("/README.md"));
  repoInfo.setSolPath(path.concat("/Solution."));
  closeGitHubRepoModal();
  launchGitHubCommitModal();
}

/**
 * Send description & code to the main process to commit to GitHub.
 */
function doGitHubCommit() {
  document.getElementById("gitHubCommitButton").classList.add("is-loading");
  repoInfo.setDescPath(document.getElementById("descPathInput").value);
  repoInfo.setSolPath(document.getElementById("solPathInput").value);
  ipcRenderer.send("commit-github", repoInfo, descEditor.getValue(), codeEditor.getValue(), document.getElementById("commitMessageInput").value);
}

/**
 * Set the commit values to the modal
 * @param {String} descCommit
 * @param {String} solCommit
 */
function setCommitToModal(descCommit, solCommit) {
  document.getElementById("gitHubCommitButton").classList.remove("is-loading");
  document.getElementById("commitSHA1").value = descCommit;
  document.getElementById("commitSHA2").value = solCommit;
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
 * Launch the GitHub Repo. modal
 */
function launchGitHubRepoModal() {
  isInDownLoadMode = true;
  repoInfo.clearContents();
  document.getElementById("gitHubRepoModal").classList.add("is-active");
  document.documentElement.classList.add("is-clipped");
  document.getElementById("gitHubRepoBackButton").innerHTML = "Close";
  ipcRenderer.send("list-repos");
}

/**
 * Close the GitHub Repo. modal
 */
function closeGitHubRepoModal() {
  const gitHubModalNode = document.getElementById("gitHubRepoModalContent");
  while (gitHubModalNode.firstChild) {
    gitHubModalNode.removeChild(gitHubModalNode.firstChild);
  }

  document.getElementById("gitHubRepoModal").classList.remove("is-active");
  document.documentElement.classList.remove("is-clipped");
}

/**
 * Go back on the GitHub Repo. modal
 */
function backGitHubRepoModal() {
  if (repoInfo.getRepoName() === "") {
    closeGitHubRepoModal();
    return;
  }

  if (repoInfo.getBranchRef() === "") {
    document.getElementById("gitHubRepoModalContent").removeChild(document.getElementById("branchListDiv"));
    ipcRenderer.send("list-repos");
    repoInfo.setRepoName("");
    document.getElementById("gitHubRepoBackButton").innerHTML = "Close";
    return;
  }

  if (repoInfo.getDirPath().length === 0) {
    document.getElementById("gitHubRepoModalContent").removeChild(document.getElementById("contentListDiv"));
    repoInfo.setBranchRef("");
    ipcRenderer.send("get-repo", repoInfo.getRepoUser(), repoInfo.getRepoName());
  } else {
    document.getElementById("gitHubRepoModalContent").removeChild(document.getElementById("contentListDiv"));
    repoInfo.getDirPath().pop();
    ipcRenderer.send("get-dir", repoInfo);
  }
}

/**
 * Launch the GitHub Commit modal
 */
function launchGitHubCommitModal() {
  isInDownLoadMode = true;
  document.getElementById("gitHubCommitModal").classList.add("is-active");
  document.documentElement.classList.add("is-clipped");
  document.getElementById("descPathInput").value = repoInfo.getDescPath();
  document.getElementById("solPathInput").value = repoInfo.getSolPath();
}

/**
 * Close the GitHub Commit modal
 */
function closeGitHubCommitModal() {
  document.getElementById("descPathInput").value = "";
  document.getElementById("solPathInput").value = "";
  document.getElementById("commitMessageInput").value = "";
  document.getElementById("commitSHA1").value = "";
  document.getElementById("commitSHA2").value = "";

  repoInfo.clearContents();

  document.getElementById("gitHubCommitModal").classList.remove("is-active");
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
 * Check credit usage.
 */
function checkUsage() {
  document.getElementById("checkUsageButton").classList.add("is-loading");
  ipcRenderer.send("check-usage");
}

/**
 * Get the content of the repository.
 * @param {String} repoUser
 * @param {String} repoName
 */
function getRepoContent(repoUser, repoName) {
  document.getElementById("gitHubRepoModalContent").removeChild(document.getElementById("repoListDiv"));
  const loadingButton = document.getElementById("gitHubRepoLoadingButton");
  loadingButton.style.display = "block";
  repoInfo.setRepoUser(repoUser);
  repoInfo.setRepoName(repoName);
  repoInfo.clearDirPath();
  ipcRenderer.send("get-repo", repoUser, repoName);
}

/**
 * Get the content of the branch.
 * @param {String} branchRef
 */
function getBranchContent(branchRef) {
  document.getElementById("gitHubRepoModalContent").removeChild(document.getElementById("branchListDiv"));
  const loadingButton = document.getElementById("gitHubRepoLoadingButton");
  loadingButton.style.display = "block";
  repoInfo.setBranchRef(branchRef);
  ipcRenderer.send("get-branch", branchRef);
}

/**
 * Get the content of the directory.
 * @param {String} dirName
 */
function getDirContent(dirName) {
  document.getElementById("gitHubRepoModalContent").removeChild(document.getElementById("contentListDiv"));
  const loadingButton = document.getElementById("gitHubRepoLoadingButton");
  loadingButton.style.display = "block";
  repoInfo.addDirToPath(dirName);
  ipcRenderer.send("get-dir", repoInfo);
}

/**
 * Get the content of the description from the provided URL.
 * @param {String} downloadURL
 */
function getDescriptionContent(downloadURL) {
  ipcRenderer.send("get-desc", downloadURL);
}

/**
 * Get the content of the solution from the provided URL.
 * @param {String} downloadURL
 */
function getSolutionContent(downloadURL) {
  ipcRenderer.send("get-sol", downloadURL);
}

/**
 * Populate the list of repositories on the modal
 */
function populateReposList(repoList) {
  document.getElementById("gitHubRepoModalTitleP").innerHTML = "GitHub Repositories";
  const loadingButton = document.getElementById("gitHubRepoLoadingButton");
  loadingButton.style.display = "none";
  const wrappingTagsDiv = createWrappingDiv("repoListDiv");
  Object.keys(repoList).forEach(key => {
    const repoButton = createSpanButton(repoList[key].name);
    repoButton.onclick = () => {
      document.getElementById("gitHubRepoBackButton").innerHTML = "Back";
      getRepoContent(repoList[key].owner.login, repoList[key].name);
    };
    wrappingTagsDiv.appendChild(repoButton);
  });
  document.getElementById("gitHubRepoModalContent").appendChild(wrappingTagsDiv);
}

/**
 * Populate the list of repositories on the modal
 */
function populateBranchList(branchList) {
  document.getElementById("gitHubRepoModalTitleP").innerHTML = "Repository Branches";
  const loadingButton = document.getElementById("gitHubRepoLoadingButton");
  loadingButton.style.display = "none";
  const wrappingTagsDiv = createWrappingDiv("branchListDiv");
  Object.keys(branchList).forEach(key => {
    const branchButton = createSpanButton(branchList[key].name);
    branchButton.onclick = () => {
      getBranchContent(branchList[key].name);
    };
    wrappingTagsDiv.appendChild(branchButton);
  });
  document.getElementById("gitHubRepoModalContent").appendChild(wrappingTagsDiv);
}

/**
 * Populate the list of repositories on the modal
 */
function populateContentList(contentList) {
  document.getElementById("gitHubRepoModalTitleP").innerHTML = "Branch Content";
  const loadingButton = document.getElementById("gitHubRepoLoadingButton");
  loadingButton.style.display = "none";
  const wrappingTagsDiv = createWrappingDiv("contentListDiv");
  const table = createTable("contentListTable", "contentListTableBody");
  Object.keys(contentList).forEach(key => {
    const tableRow = createContentRow(contentList[key]);
    table.appendChild(tableRow);
  });
  wrappingTagsDiv.appendChild(table);
  document.getElementById("gitHubRepoModalContent").appendChild(wrappingTagsDiv);
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

/**
 * Handle the "check-usage" event.
 */
ipcRenderer.on("usage-checked", (event, code) => {
  document.getElementById("checkUsageButton").classList.remove("is-loading");
});

/**
 * Handle the description template recieved event.
 */
ipcRenderer.on("desc-template", (event, desc) => {
  document.getElementById("resetDescButton").classList.remove("is-loading");
  descEditor.setValue(desc);
});

/**
 * Handle the solution template recieved event.
 */
ipcRenderer.on("sol-template", (event, code) => {
  document.getElementById("resetSolButton").classList.remove("is-loading");
  codeEditor.setValue(code);
});

/**
 * Handle the receipt of the list of the repositories associated to the currently authenticated user.
 */
ipcRenderer.on("repos-list", (event, repoList) => {
  populateReposList(repoList);
});

/**
 * Handle the receipt of the list of the selected respository"s branches.
 */
ipcRenderer.on("branch-list", (event, branchList) => {
  populateBranchList(branchList);
});

/**
 * Handle the receipt of the branch content.
 */
ipcRenderer.on("branch-contents", (event, contentList) => {
  populateContentList(contentList);
});

/**
 * Handle the receipt of the directory content.
 */
ipcRenderer.on("dir-contents", (event, contentList) => {
  populateContentList(contentList);
});

/**
 * Handle the description downloaded event.
 */
ipcRenderer.on("got-desc", (event, content) => {
  if (content[0] !== null && content[0].length > 0) {
    updateDesc(content[0]);
  }
});

/**
 * Handle the solution downloaded event.
 */
ipcRenderer.on("got-sol", (event, content) => {
  if (content[0] !== null && content[0].length > 0) {
    updateCode(content[0]);
  }
});

/**
 * Handle the commit event.
 */
ipcRenderer.on("committed", (event, descCommit, solCommit) => {
  setCommitToModal(descCommit, solCommit);
});
