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
  document.getElementById("executeCodeButton").classList.add("is-loading");
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
  const span = createSpanButton(language[1])
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
      language: currLang[3],
      renderWhitespace: "all",
      scrollBeyondLastLine: false,
      theme: "vs-dark",
      value: [
        "public class CodeGoesHere {",
        "\tpublic static void main(String[] args) {",
        "\t\tSystem.out.println(\"Hello from Monaco!\");",
        "\t}",
        "}",
      ].join("\n"),
    });
  });
})();
