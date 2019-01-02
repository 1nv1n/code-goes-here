/** For common functions */

/**
 * Create the wrapping "tags" div for a collection of buttons/tags.
 * @param {String} divId - The ID of the DIV to be created.
 */
function createWrappingDiv(divId) {
  const outerDiv = document.createElement("div");
  outerDiv.id = divId;
  outerDiv.classList.add("buttons");
  return outerDiv;
}

/**
 * Creates a span button.
 * @param {*} buttonInnerHTML - The inner HTML to use for the button.
 */
function createSpanButton(buttonInnerHTML) {
  const span = document.createElement("span");
  span.classList.add("button");
  span.classList.add("is-small");
  span.classList.add("is-rounded");
  span.classList.add("is-link");
  span.innerHTML = buttonInnerHTML;
  return span;
}

/**
 * Creates a table with the provided IDs.
 * @param {String} tableId
 * @param {String} tableBodyId
 */
function createTable(tableId, tableBodyId) {
  const table = document.createElement("table");
  table.id = tableId;
  table.classList.add("table");
  table.classList.add("is-narrow");

  const tableBody = document.createElement("tbody");
  tableBody.id = tableBodyId;

  table.appendChild(tableBody);
  return table;
}

/**
 * Creates a row for the content of the branch/directory on the table.
 * @param {*} contentElement
 */
function createContentRow(contentElement) {
  const tableRow = document.createElement("tr");
  const iconCell = document.createElement("td");
  const downloadCell = document.createElement("td");
  const elementButton = document.createElement("button");
  const descButton = document.createElement("button");
  const solButton = document.createElement("button");

  elementButton.classList.add("button");
  elementButton.classList.add("is-small");

  descButton.classList.add("button");
  descButton.classList.add("is-small");
  descButton.classList.add("is-link");

  solButton.classList.add("button");
  solButton.classList.add("is-small");
  solButton.classList.add("is-link");

  if (contentElement.type === "dir") {
    elementButton.innerHTML = "<span class='icon is-small'><i class='far fa-folder'></i></span> &emsp;" + contentElement.name;
    elementButton.onclick = () => { getDirContent(contentElement.name); };

    iconCell.appendChild(elementButton);
  } else {
    elementButton.innerHTML = "<span class='icon is-small'><i class='far fa-file'></i></span> &emsp;" + contentElement.name;
    elementButton.setAttribute("disabled", "");

    descButton.innerHTML = "<span class='icon is-small'><i class='fas fa-download'></i></span> &emsp; Description";
    descButton.onclick = () => { getDescriptionContent(contentElement.download_url); };
    descButton.setAttribute("title", "Download/Set Description");

    solButton.innerHTML = "<span class='icon is-small'><i class='fas fa-download'></i></span> &emsp; Solution";
    solButton.onclick = () => { getSolutionContent(contentElement.download_url); };
    solButton.setAttribute("title", "Download/Set Solution");

    iconCell.appendChild(elementButton);
    downloadCell.appendChild(descButton);
    downloadCell.appendChild(solButton);
  }

  tableRow.appendChild(iconCell);
  tableRow.appendChild(downloadCell);

  return tableRow;
}
