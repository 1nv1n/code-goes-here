// Define the Monaco & the Code Editor
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
      value: [
        "# Problem Description",
        "Create a greet function\n",
        "## Sample output",
        "Hello from Monaco!",
      ].join("\n"),
      language: "markdown",
      lineNumbers: "off",
      minimap: {
        enabled: false,
      },
      roundedSelection: false,
      scrollBeyondLastLine: false,
      theme: "vs-dark",
    });
  });
})();
