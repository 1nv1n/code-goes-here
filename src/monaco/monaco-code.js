const { createSpanButton, createWrappingDiv } = require("../common/common");
const { sendCodeToMainProcess } = require("../jdoodle/jDoodleRenderer");

// Define the editor object
let monacoCodeEditor;

// Placeholder for the current language
let currLang = ["java", "Java (JDK 1.8.0_66)", "0", "java"];

/**
 * Initialize the Monaco Code Editor.
 */
(function initCodeEditor() {// Workaround for monaco-css not understanding the environment
  self.module = undefined;
  _globalAMDRequire(["vs/editor/editor.main"], () => {
    monacoCodeEditor = monaco.editor;
    _globalCodeEditor = monaco.editor.create(document.getElementById("monCodeEditor"), {
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
}());

/**
 * Send the code to the renderer to be sent to the main process for execution.
 */
function sendCodeForExecution() {
  document.getElementById("jDoodleExecuteButton").classList.add("is-loading");
  sendCodeToMainProcess(_globalCodeEditor.getValue(), currLang[0], currLang[2]);
}

/**
 * Update the editor's existing value with the update.
 *
 * @param {String} code
 */
function updateCode(code) {
  _globalCodeEditor.setValue(code);
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
  monacoCodeEditor.setModelLanguage(_globalCodeEditor.getModel(), language[3]);
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
  Object.keys(_globalLanguageArr).forEach((key) => {
    const languageTag = createLanguageButton(_globalLanguageArr[key]);
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
  _globalCodeEditor.setValue("");
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

export {
  sendCodeForExecution,
  updateCode,
  closeLanguageModal,
  openLanguageModal,
  clearCode,
  resetCode,
  toggleMonColCode,
};
