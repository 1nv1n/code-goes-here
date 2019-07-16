/**
 * Launch the LeetCode Modal
 */
function launchLeetCodeModal() {
  _globalIPCRenderer.send("leetcode-version");
  _globalIPCRenderer.send("leetcode-user");
  document.getElementById("leetCodeModal").classList.add("is-active");
  document.documentElement.classList.add("is-clipped");
  postModalLaunchSteps();
}

/**
 * Launch the LeetCode List Modal
 */
function launchLeetCodeListModal() {
  if (_globalProbList == null) {
    _globalIPCRenderer.send("leetcode-list");
  }
  document.getElementById("leetCodeListModal").classList.add("is-active");
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
 * Close the LeetCode modal
 */
function closeLeetCodeListModal() {
  document.getElementById("leetCodeListModal").classList.remove("is-active");
  document.documentElement.classList.remove("is-clipped");
}

/**
 * Log out of LeetCode.
 */
function leetCodeLogOut() {
  document.getElementById("logoutLeetCodeButton").classList.add("is-loading");
  clearLCModalContent();
  _globalIPCRenderer.send("leetcode-logout");
}

/**
 * Display the problem description of the provided problem
 * @param {*} probNum
 */
function showProblem(probNum) {
  closeLeetCodeListModal();
  _globalIPCRenderer.send("leetcode-prob", probNum);
}

/**
* Toggles the enabled/disabled state of the buttons related to LeetCode.
*/
function toggleLeetCodeButtons() {
  if (_globalPref.leetCodeUsername.length > 0 && _globalPref.leetCodePassword.length > 0) {
    document.getElementById("lCodeListButton").disabled = false;
    document.getElementById("lCodeLogOutButton").disabled = false;
  } else {
    document.getElementById("lCodeListButton").disabled = true;
    document.getElementById("lCodeSubmitButton").disabled = true;
    document.getElementById("lCodeLogOutButton").disabled = true;
  }
}

function postModalLaunchSteps() {
  document.getElementById("leetCodeLogStatusControl").classList.add("is-loading");
  document.getElementById("leetCodeStatsControl").classList.add("is-loading");
}

function clearLCModalContent() {
  document.getElementById("leetCodeLogStatus").value = "";
  document.getElementById("leetCodeStats").value = "";
}

/**
 * Creates a row for the content of a problem.
 * @param {*} contentElement
 */
function createLCContentRow(contentElement) {
  const tableRow = document.createElement("tr");
  const probNumCell = document.createElement("td");

  const elementButton = document.createElement("button");
  elementButton.classList.add("button");
  elementButton.classList.add("is-small");
  elementButton.classList.add("is-link");
  elementButton.innerHTML = contentElement.probNum;
  elementButton.onclick = () => { showProblem(contentElement.probNum); };
  probNumCell.appendChild(elementButton);

  const probTitleCell = document.createElement("td");
  probTitleCell.innerHTML = contentElement.probTitle;

  const probDiffCell = document.createElement("td");
  probDiffCell.innerHTML = contentElement.probDiff;

  tableRow.appendChild(probNumCell);
  tableRow.appendChild(probTitleCell);
  tableRow.appendChild(probDiffCell);

  return tableRow;
}

export {
  launchLeetCodeModal,
  launchLeetCodeListModal,
  closeLeetCodeModal,
  leetCodeLogOut,
  toggleLeetCodeButtons,
  createLCContentRow,
};
