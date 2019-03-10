/** Functions for the GitHub Modal */

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
 * Launch the GitHub Modal to select a directory to commit to.
 */
function launchGitHubRepoModalForCommit() {
  launchGitHubRepoModal();
  _globalIsInDownLoadMode = false;
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
  _globalIPCRenderer.send("commit-github", _globalRepoInfo, descEditor.getValue(), codeEditor.getValue(), document.getElementById("commitMessageInput").value);
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
 * Launch the GitHub Repo. modal
 */
function launchGitHubRepoModal() {
  _globalIsInDownLoadMode = true;
  _globalRepoInfo.clearContents();
  document.getElementById("gitHubRepoModal").classList.add("is-active");
  document.documentElement.classList.add("is-clipped");
  document.getElementById("gitHubRepoBackButton").innerHTML = "Close";
  _globalIPCRenderer.send("list-repos");
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
 * Launch the GitHub Commit modal
 */
function launchGitHubCommitModal() {
  _globalIsInDownLoadMode = true;
  document.getElementById("gitHubCommitModal").classList.add("is-active");
  document.documentElement.classList.add("is-clipped");
  document.getElementById("commitDescFilePathInput").value = _globalRepoInfo.getDescPath();
  document.getElementById("commitCodeFilePathInput").value = _globalRepoInfo.getSolPath();
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
  const wrappingTagsDiv = _globalCommonJS.createWrappingDiv("repoListDiv");
  Object.keys(repoList).forEach((key) => {
    const repoButton = _globalCommonJS.createSpanButton(repoList[key].name);
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
  const wrappingTagsDiv = _globalCommonJS.createWrappingDiv("branchListDiv");
  Object.keys(branchList).forEach((key) => {
    const branchButton = _globalCommonJS.createSpanButton(branchList[key].name);
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
  const wrappingTagsDiv = _globalCommonJS.createWrappingDiv("contentListDiv");
  const table = _globalCommonJS.createTable("contentListTable", "contentListTableBody");
  Object.keys(contentList).forEach((key) => {
    const tableRow = _globalCommonJS.createGHContentRow(contentList[key]);
    table.appendChild(tableRow);
  });
  wrappingTagsDiv.appendChild(table);
  document.getElementById("gitHubRepoModalContent").appendChild(wrappingTagsDiv);
}
