# code-goes-here

Code Goes Here is intended to be a one-stop solution for writing, executing & evaluating code; mitigating the reliance on various websites that offer problems & an online IDE experience to solve those problems, but don't offer an easy way to export written code to one's own repository.

## Built With

 * Electron (https://electronjs.org/)
 * Bulma (https://bulma.io)
 * Monaco Editor (https://github.com/Microsoft/monaco-editor)

## Usage
 * Install nodejs (https://nodejs.org/en/download/)
 * Install Electron Forge (npm install -g electron-forge)
 * git clone https://github.com/1nv1n/code-goes-here.git
 * Create file "credentials.js" in directory: "code-goes-here\src\jdoodle" with the following content (replace the placeholders with your versions after registering at: https://www.jdoodle.com/faq):
 ```javascript
function define(name, value) {
    Object.defineProperty(exports, name, {
      value: value,
      enumerable: true,
    });
  }

  // JDoodle Credentials
  define("CLIENT_ID", "YOUR_CLIENT_ID_HERE");
  define("CLIENT_SECRET", "YOUR_CLIENT_SECRET_HERE");
```
 * Create file "credentials.js" in directory: "code-goes-here\src\github" with the following content (replace the placeholders with your versions after registering GitHub Developer Settings):
 ```javascript
function define(name, value) {
    Object.defineProperty(exports, name, {
      value: value,
      enumerable: true,
    });
  }

  // GitHub OAuth App Credentials
  define("CLIENT_ID", "YOUR_CLIENT_ID_HERE");
  define("CLIENT_SECRET", "YOUR_CLIENT_SECRET_HERE");
```
 * From the root directory (code-goes-here); run:
   * `npm install`
   * `npm start`

## Goals & Features

 * Monaco editor for problem description.
   * Should describe what problem is to be solved.
   * Could use markdown syntax.
   * Could include examples, sample input(s)/output(s), notes, etc.
   * Could use https://github.com/markdown-it/markdown-it for preview purposes.
 * Monaco editor for problem solution.
   * Use all the features (including language support) from the editor that powers Visual Studio Code.
 * GitHub integration (user setup required)
   * Problem & solution should be uploadable onto a provided GitHub repository.
   * Problem & solution set should be downloadable from the provided GitHub.
 * Code execution (user setup required)
   * Solution should be able to be run on (free/paid) third-party online compilers.
   * This should provide the user the expected output as well as compute metrics (CPU, memory usage).
   * Example: https://www.jdoodle.com/

## Task List Status
 - [ ] "File Browser" like functionality to see & categorize (folders) solutions & offer advanced local Git as well as GitHub integration.
 - [ ] Provision a "snippets" system that allows for user-defined snippets & code (commonly used methods) to be pulled in at will to avoid write-duplication.
 - [ ] Create a tags system to allow for problems & solutions to be tagged (user-defined (eg: easy, hard, leet, tree, graph, array, etc.))
 - [ ] Advanced/multiple third-party compiler integration.
 - [x] Basic compiler provision (JDoodle).
 - [ ] Basic GitHub integration (Commit to provided repository).
 - [x] Basic HTTP "download" of description & solution (eg: Raw content from GitHub).
 - [x] Set basic code editor.
 - [x] Set basic description editor.
 - [x] Pull in the Monaco Editor.
 - [x] Pull in the Bulma CSS framework.
 - [x] Initialize Electron application using Electron Forge.

## Work-In-Progress Screenshot
![code-supposed-to-go-here](https://i.imgur.com/mDOczNB.png)