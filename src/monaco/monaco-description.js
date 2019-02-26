// Define the editor objects
let monacoDescEditor;
let descEditor;

/**
 * Update the editor's existing value with the update.
 *
 * @param {String} description
 */
function updateDesc(description) {
  descEditor.setValue(description);
}

/**
 * Clear the content of the description editor.
 */
function clearDesc() {
  descEditor.setValue("");
}

/**
 * Reset the content of the description editor to the value from the template.
 */
function resetDesc() {
  document.getElementById("resetDescButton").classList.add("is-loading");
  _globalIPCRenderer.send("reset-desc");
}

/**
 * Collapse the description editor column.
 */
function toggleMonColDesc() {
  if (document.getElementById("toggleMonColDescButton").value === "min") {
    document.getElementById("descColumn").classList.remove("is-4");
    document.getElementById("descColumn").classList.add("is-hidden-touch");
    document.getElementById("descColumn").classList.add("is-hidden-tablet");
    document.getElementById("descColumn").classList.add("is-hidden-desktop");

    document.getElementById("codeColumn").classList.remove("is-8");
    document.getElementById("codeColumn").classList.add("is-12");

    document.getElementById("descMonColBtnIcon").classList.remove("fa-minus");
    document.getElementById("descMonColBtnIcon").classList.add("fa-plus");

    document.getElementById("toggleMonColDescButton").value = "max";
    document.getElementById("toggleMonColDescButton").title = "Maximize Description Column";
  } else {
    document.getElementById("descColumn").classList.add("is-4");
    document.getElementById("descColumn").classList.remove("is-hidden-touch");
    document.getElementById("descColumn").classList.remove("is-hidden-tablet");
    document.getElementById("descColumn").classList.remove("is-hidden-desktop");

    document.getElementById("codeColumn").classList.remove("is-12");
    document.getElementById("codeColumn").classList.add("is-8");

    document.getElementById("descMonColBtnIcon").classList.add("fa-minus");
    document.getElementById("descMonColBtnIcon").classList.remove("fa-plus");

    document.getElementById("toggleMonColDescButton").value = "min";
    document.getElementById("toggleMonColDescButton").title = "Minimize Description Column";
  }
}

/**
 * Initialize the Monaco Editor.
 */
(function initMonaco() {
  const path = require("path");
  const amdLoader = require("../node_modules/monaco-editor/min/vs/loader.js");
  const amdRequire = amdLoader.require;
  const amdDefine = amdLoader.require.define;

  function uriFromPath(_path) {
    let pathName = path.resolve(_path).replace(/\\/g, "/");
    if (pathName.length > 0 && pathName.charAt(0) !== "/") {
      pathName = "/" + pathName;
    }
    return encodeURI("file://" + pathName);
  }

  amdRequire.config({
    baseUrl: uriFromPath(path.join(__dirname, "../node_modules/monaco-editor/min")),
  });

  // workaround monaco-css not understanding the environment
  self.module = undefined;

  amdRequire(["vs/editor/editor.main"], function () {
    monacoDescEditor = monaco.editor;
    descEditor = monaco.editor.create(document.getElementById("monDescEditor"), {
      automaticLayout: true, // This incurs some performance cost
      language: "markdown",
      lineNumbers: "off",
      minimap: {
        enabled: false,
      },
      renderWhitespace: "all",
      roundedSelection: false,
      scrollBeyondLastLine: false,
      theme: "vs-dark",
      value: [
        "",
      ].join("\n"),
    });
  });
})();
