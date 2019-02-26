// Import the supported languages
const languageArr = require("./jdoodle/languages");

// Define the editor objects
let monacoCodeEditor;
let codeEditor;

// Placeholder for the current language
let currLang = ["java", "Java (JDK 1.8.0_66)", "0", "java"];

/**
 * Send the code to the renderer to be sent to the main process for execution.
 */
function sendCodeForExecution() {
  document.getElementById("jDoodleExecuteButton").classList.add("is-loading");
  sendCodeToMainProcess(codeEditor.getValue(), currLang[0], currLang[2]);
}

/**
 * Update the editor's existing value with the update.
 *
 * @param {String} code
 */
function updateCode(code) {
  codeEditor.setValue(code);
}

/**
 * Close the language selection modal.
 */
function closeLanguageModal() {
  document.getElementById("languageModal").classList.remove("is-active");
  document.documentElement.classList.remove("is-clipped");
}

/**
 * Update the language of the code editor.
 * @param {*} language
 */
function updateLanguage(language) {
  currLang = language;
  monacoCodeEditor.setModelLanguage(codeEditor.getModel(), language[3]);
  closeLanguageModal();
}

/**
 * Create a span button per language.
 * @param {*} language
 */
function createLanguageButton(language) {
  const span = createSpanButton(language[1]);
  span.onclick = () => { updateLanguage(language); };
  return span;
}

/**
 * Populate languages in the modal.
 */
function populateLanguages() {
  const wrappingTagsDiv = createWrappingDiv("languageButtonsDiv");
  Object.keys(languageArr).forEach((key) => {
    const languageTag = createLanguageButton(languageArr[key]);
    wrappingTagsDiv.appendChild(languageTag);
  });
  document.getElementById("languageModalContent").appendChild(wrappingTagsDiv);
}

/**
 * Initialize & open the modal for language selection.
 */
function openLanguageModal() {
  // Populate languages only if we haven't already done so.
  if (document.getElementById("languageButtonsDiv") === null) {
    populateLanguages();
  }

  document.getElementById("languageModal").classList.add("is-active");
  document.documentElement.classList.add("is-clipped");
}

/**
 * Clear the content of the solution editor.
 */
function clearCode() {
  codeEditor.setValue("");
}

/**
 * Clear the content of the solution editor to the value from the template.
 */
function resetCode() {
  document.getElementById("resetSolButton").classList.add("is-loading");
  _globalIPCRenderer.send("reset-code", 1);
}

/**
 * Collapse the code editor column.
 */
function toggleMonColCode() {
  if (document.getElementById("toggleMonColCodeButton").value === "min") {
    document.getElementById("codeColumn").classList.remove("is-8");
    document.getElementById("codeColumn").classList.add("is-hidden-touch");
    document.getElementById("codeColumn").classList.add("is-hidden-tablet");
    document.getElementById("codeColumn").classList.add("is-hidden-desktop");

    document.getElementById("descColumn").classList.remove("is-4");
    document.getElementById("descColumn").classList.add("is-12");

    document.getElementById("codeMonColBtnIcon").classList.remove("fa-minus");
    document.getElementById("codeMonColBtnIcon").classList.add("fa-plus");

    document.getElementById("toggleMonColCodeButton").value = "max";
    document.getElementById("toggleMonColCodeButton").title = "Maximize Code Column";
  } else {
    document.getElementById("codeColumn").classList.remove("is-hidden-touch");
    document.getElementById("codeColumn").classList.remove("is-hidden-tablet");
    document.getElementById("codeColumn").classList.remove("is-hidden-desktop");
    document.getElementById("codeColumn").classList.add("is-8");

    document.getElementById("descColumn").classList.remove("is-12");
    document.getElementById("descColumn").classList.add("is-4");

    document.getElementById("codeMonColBtnIcon").classList.add("fa-minus");
    document.getElementById("codeMonColBtnIcon").classList.remove("fa-plus");

    document.getElementById("toggleMonColCodeButton").value = "min";
    document.getElementById("toggleMonColCodeButton").title = "Minimize Code Column";
  }
}

/**
 * Initialize the Monaco Code Editor.
 */
(function initMonacoEditor() {
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

  // Workaround for monaco-css not understanding the environment
  self.module = undefined;

  amdRequire(["vs/editor/editor.main"], function () {
    monacoCodeEditor = monaco.editor;
    codeEditor = monaco.editor.create(document.getElementById("monCodeEditor"), {
      automaticLayout: true, // This incurs some performance cost
      insertSpaces: true,
      language: currLang[3],
      renderWhitespace: "all",
      scrollBeyondLastLine: false,
      tabSize: 2,
      theme: "vs-dark",
      value: [
        "",
      ].join("\n"),
    });
  });
})();
