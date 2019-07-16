/** A common file for shared methods & functions */

/**
 * Returns an encoded URI, given the path
 * @param {*} _path
 */
function uriFromPath(_path) {
  let pathName = _globalPathModule.resolve(_path).replace(/\\/g, "/");
  if (pathName.length > 0 && pathName.charAt(0) !== "/") {
    pathName = `/${pathName}`;
  }
  return encodeURI(`file://${pathName}`);
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
 * Get the content of the description from the provided URL.
 * @param {String} downloadURL
 */
function getDescriptionContent(downloadURL) {
  _globalIPCRenderer.send("get-desc", downloadURL);
}

/**
 * Get the content of the solution from the provided URL.
 * @param {String} downloadURL
 */
function getSolutionContent(downloadURL) {
  _globalIPCRenderer.send("get-sol", downloadURL);
}

export {
  uriFromPath,
  launchDownloadModal,
  closeDownloadModal,
  createWrappingDiv,
  createSpanButton,
  createTable,
  getDescriptionContent,
  getSolutionContent,
};
