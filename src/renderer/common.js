/** For common functions */

module.exports = {
  /**
  * Create the wrapping "tags" div for a collection of buttons/tags.
  * @param {String} divId - The ID of the DIV to be created.
  */
  createWrappingDiv: function createWrappingDiv(divId) {
    const outerDiv = document.createElement("div");
    outerDiv.id = divId;
    outerDiv.classList.add("buttons");
    return outerDiv;
  },
  /**
  * Creates a span button.
  * @param {*} buttonInnerHTML - The inner HTML to use for the button.
  */
  createSpanButton: function createSpanButton(buttonInnerHTML) {
    const span = document.createElement("span");
    span.classList.add("button");
    span.classList.add("is-small");
    span.classList.add("is-rounded");
    span.classList.add("is-link");
    span.innerHTML = buttonInnerHTML;
    return span;
  },
  /**
 * Creates a table with the provided IDs.
 * @param {String} tableId
 * @param {String} tableBodyId
 */
  createTable: function createTable(tableId, tableBodyId) {
    const table = document.createElement("table");
    table.id = tableId;
    table.classList.add("table");
    table.classList.add("is-narrow");

    const tableBody = document.createElement("tbody");
    tableBody.id = tableBodyId;

    table.appendChild(tableBody);
    return table;
  },
  /**
   * Creates a row for the content of the branch/directory on the table.
   * @param {*} contentElement
   */
  createGHContentRow: function createGHContentRow(contentElement) {
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

      if (!_globalIsInDownLoadMode) {
        commitButton.innerHTML = "<span class='icon is-small'><i class='fas fa-upload'></i></span> &emsp; Commit Here";
        commitButton.onclick = () => { startGitHubCommit(contentElement.path); };
        commitButton.setAttribute("title", "Write to GitHub");
        downloadCell.appendChild(commitButton);
      }
    } else {
      elementButton.innerHTML = `<span class='icon is-small'><i class='far fa-file'></i></span> &emsp; ${contentElement.name}`;
      elementButton.setAttribute("disabled", "");

      if (_globalIsInDownLoadMode) {
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
  },
  /**
   * Creates a row for the content of a problem.
   * @param {*} contentElement
   */
  createLCContentRow: function createLCContentRow(contentElement) {
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
  },
};
