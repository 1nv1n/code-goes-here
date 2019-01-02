import { ipcRenderer } from "electron";
import { Repository } from "./github/repository";

const { BrowserWindow } = require("electron").remote;

const repoInfo = new Repository();

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
  ipcRenderer.send("download", document.getElementById("probDescInput").value, document.getElementById("solutionInput").value);
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
  document.getElementById("gitHubRepoModal").classList.add("is-active");
  document.documentElement.classList.add("is-clipped");
  ipcRenderer.send("list-repos");
}

/**
 * Close the GitHub Repo. modal
 */
function closeGitHubRepoModal() {
  var gitHubModalNode = document.getElementById("gitHubRepoModalContent");
  while (gitHubModalNode.firstChild) {
      gitHubModalNode.removeChild(gitHubModalNode.firstChild);
  }

  document.getElementById("gitHubRepoModal").classList.remove("is-active");
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
  Object.keys(repoList).forEach((key) => {
    const repoButton = createSpanButton(repoList[key].name);
    repoButton.onclick = () => { getRepoContent(repoList[key].owner.login, repoList[key].name); };
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
  Object.keys(branchList).forEach((key) => {
    const branchButton = createSpanButton(branchList[key].name);
    branchButton.onclick = () => { getBranchContent(branchList[key].name); };
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
  Object.keys(contentList).forEach((key) => {
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
 * Handle the receipt of the list of the repositories associated to the currently authenticated user.
 */
ipcRenderer.on("repos-list", (event, repoList) => {
  populateReposList(repoList);
});

/**
 * Handle the receipt of the list of the selected respository's branches.
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
