// eslint-disable-next-line import/no-unresolved
import {
  createSpanButton, createTable, createWrappingDiv, getDescriptionContent, getSolutionContent,
} from "../common/common";

/**
 * Launch the GitHub Commit modal
 */
function launchGitHubCommitModal() {
  _globalDownLoadModeInd = true;
  document.getElementById("gitHubCommitModal").classList.add("is-active");
  document.documentElement.classList.add("is-clipped");
  document.getElementById("commitDescFilePathInput").value = _globalRepoInfo.getDescPath();
  document.getElementById("commitCodeFilePathInput").value = _globalRepoInfo.getSolPath();
}

/**
 * Launch the GitHub Repo. modal
 */
function launchGitHubRepoModal() {
  _globalDownLoadModeInd = true;
  _globalRepoInfo.clearContents();
  document.getElementById("gitHubRepoModal").classList.add("is-active");
  document.documentElement.classList.add("is-clipped");
  document.getElementById("gitHubRepoBackButton").innerHTML = "Close";
  _globalIPCRenderer.send("list-repos");
}

/**
 * Launch the GitHub Modal to select a directory to commit to.
 */
function launchGitHubRepoModalForCommit() {
  launchGitHubRepoModal();
  _globalDownLoadModeInd = false;
}

/**
 * Toggles the enabled/disabled state of the buttons related to GitHub.
 */
function toggleGitHubButtons() {
  if (_globalPref.gitHubToken.length > 0) {
    document.getElementById("gHdownloadContentButton").disabled = false;
    document.getElementById("gHCommitButton").disabled = false;
  } else {
    document.getElementById("gHdownloadContentButton").disabled = true;
    document.getElementById("gHCommitButton").disabled = true;
  }
}

/**
 * Launch the GitHub commit modal.
 * @param {String} path
 */
function startGitHubCommit(path) {
  _globalRepoInfo.setDescPath(path.concat("/README.md"));
  _globalRepoInfo.setSolPath(path.concat("/Solution."));
  closeGitHubRepoModal();
  launchGitHubCommitModal();
}

/**
 * Send description & code to the main process to commit to GitHub.
 */
function doGitHubCommit() {
  document.getElementById("gitHubCommitButton").classList.add("is-loading");
  _globalRepoInfo.setDescPath(document.getElementById("commitDescFilePathInput").value);
  _globalRepoInfo.setSolPath(document.getElementById("commitCodeFilePathInput").value);
  _globalIPCRenderer.send("commit-github", _globalRepoInfo, _globalDescEditor.getValue(), _globalCodeEditor.getValue(), document.getElementById("commitMessageInput").value);
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
  if (_globalRepoInfo.getRepoName() === "") {
    closeGitHubRepoModal();
    return;
  }

  if (_globalRepoInfo.getBranchRef() === "") {
    document.getElementById("gitHubRepoModalContent").removeChild(document.getElementById("branchListDiv"));
    _globalIPCRenderer.send("list-repos");
    _globalRepoInfo.setRepoName("");
    document.getElementById("gitHubRepoBackButton").innerHTML = "Close";
    return;
  }

  if (_globalRepoInfo.getDirPath().length === 0) {
    document.getElementById("gitHubRepoModalContent").removeChild(document.getElementById("contentListDiv"));
    _globalRepoInfo.setBranchRef("");
    _globalIPCRenderer.send("get-repo", _globalRepoInfo.getRepoUser(), _globalRepoInfo.getRepoName());
  } else {
    document.getElementById("gitHubRepoModalContent").removeChild(document.getElementById("contentListDiv"));
    _globalRepoInfo.getDirPath().pop();
    _globalIPCRenderer.send("get-dir", _globalRepoInfo);
  }
}

/**
 * Close the GitHub Commit modal
 */
function closeGitHubCommitModal() {
  document.getElementById("commitDescFilePathInput").value = "";
  document.getElementById("commitCodeFilePathInput").value = "";
  document.getElementById("commitMessageInput").value = "";
  document.getElementById("commitSHA1").value = "";
  document.getElementById("commitSHA2").value = "";

  _globalRepoInfo.clearContents();

  document.getElementById("gitHubCommitModal").classList.remove("is-active");
  document.documentElement.classList.remove("is-clipped");
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
  _globalRepoInfo.setRepoUser(repoUser);
  _globalRepoInfo.setRepoName(repoName);
  _globalRepoInfo.clearDirPath();
  _globalIPCRenderer.send("get-repo", repoUser, repoName);
}

/**
 * Get the content of the branch.
  * @param {String} branchRef
 */
function getBranchContent(branchRef) {
  document.getElementById("gitHubRepoModalContent").removeChild(document.getElementById("branchListDiv"));
  const loadingButton = document.getElementById("gitHubRepoLoadingButton");
  loadingButton.style.display = "block";
  _globalRepoInfo.setBranchRef(branchRef);
  _globalIPCRenderer.send("get-branch", branchRef);
}

/**
 * Get the content of the directory.
 * @param {String} dirName
 */
function getDirContent(dirName) {
  document.getElementById("gitHubRepoModalContent").removeChild(document.getElementById("contentListDiv"));
  const loadingButton = document.getElementById("gitHubRepoLoadingButton");
  loadingButton.style.display = "block";
  _globalRepoInfo.addDirToPath(dirName);
  _globalIPCRenderer.send("get-dir", _globalRepoInfo);
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
  Object.keys(branchList).forEach((key) => {
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
  Object.keys(contentList).forEach((key) => {
    const tableRow = createGHContentRow(contentList[key]);
    table.appendChild(tableRow);
  });
  wrappingTagsDiv.appendChild(table);
  document.getElementById("gitHubRepoModalContent").appendChild(wrappingTagsDiv);
}

/**
 * Creates a row for the content of the branch/directory on the table.
   * @param {*} contentElement
 */
function createGHContentRow(contentElement) {
  const tableRow = document.createElement("tr");
  const iconCell = document.createElement("td");
  const downloadCell = document.createElement("td");
  const elementButton = document.createElement("button");
  const commitButton = document.createElement("button");
  const downloadDescButton = document.createElement("button");
  const downloadCodeButton = document.createElement("button");

  elementButton.classList.add("button");
  elementButton.classList.add("is-small");

  commitButton.classList.add("button");
  commitButton.classList.add("is-small");
  commitButton.classList.add("is-link");

  downloadDescButton.classList.add("button");
  downloadDescButton.classList.add("is-small");
  downloadDescButton.classList.add("is-link");

  downloadCodeButton.classList.add("button");
  downloadCodeButton.classList.add("is-small");
  downloadCodeButton.classList.add("is-link");

  if (contentElement.type === "dir") {
    elementButton.innerHTML = `<span class='icon is-small'><i class='far fa-folder'></i></span> &emsp; ${contentElement.name}`;
    elementButton.onclick = () => { getDirContent(contentElement.name); };

    iconCell.appendChild(elementButton);

    if (!_globalDownLoadModeInd) {
      commitButton.innerHTML = "<span class='icon is-small'><i class='fas fa-upload'></i></span> &emsp; Commit Here";
      commitButton.onclick = () => { startGitHubCommit(contentElement.path); };
      commitButton.setAttribute("title", "Write to GitHub");
      downloadCell.appendChild(commitButton);
    }
  } else {
    elementButton.innerHTML = `<span class='icon is-small'><i class='far fa-file'></i></span> &emsp; ${contentElement.name}`;
    elementButton.setAttribute("disabled", "");

    if (_globalDownLoadModeInd) {
      downloadDescButton.innerHTML = "<span class='icon is-small'><i class='fas fa-download'></i></span> &emsp; Description";
      downloadDescButton.onclick = () => { getDescriptionContent(contentElement.download_url); };
      downloadDescButton.setAttribute("title", "Download/Set Description");

      downloadCodeButton.innerHTML = "<span class='icon is-small'><i class='fas fa-download'></i></span> &emsp; Solution";
      downloadCodeButton.onclick = () => { getSolutionContent(contentElement.download_url); };
      downloadCodeButton.setAttribute("title", "Download/Set Solution");

      downloadCell.appendChild(downloadDescButton);
      downloadCell.appendChild(downloadCodeButton);
    }

    iconCell.appendChild(elementButton);
  }

  tableRow.appendChild(iconCell);
  tableRow.appendChild(downloadCell);

  return tableRow;
}

export {
  launchGitHubRepoModal,
  launchGitHubRepoModalForCommit,
  closeGitHubRepoModal,
  closeGitHubCommitModal,
  toggleGitHubButtons,
  doGitHubCommit,
  setCommitToModal,
  backGitHubRepoModal,
  populateReposList,
  populateBranchList,
  populateContentList,
};
