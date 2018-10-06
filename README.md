# code-goes-here

Code Goes Here is intended to be a one-stop solution for writing, executing & evaluating code; mitigating the reliance on various websites that offer problems & an online IDE experience to solve those problems, but don't offer an easy way to export written code to one's own repository.

## Built With

 * Electron (https://electronjs.org/)
 * Bulma (https://bulma.io)
 * Monaco Editor (https://github.com/Microsoft/monaco-editor)

## Goals & Features

 * Monaco editor for problem description.
   * Should describe what problem is to be solved.
   * Could use markdown syntax.
   * Could include examples, sample input(s)/output(s), notes, etc.
   * Could use https://github.com/markdown-it/markdown-it for preview purposes.
 * Monaco editor for problem solution.
   * Use all the features from the code editor that powers Visual Studio Code.
   * Should provide language preference options.
 * GitHub integration (user setup required)
   * Problem & solution should be uploadable onto a provided GitHub repository.
   * Problem & solution set should be downloadable from the provided GitHub for coding improvements.
 * Code execution (user setup required)
   * Solution should be able to be run on (free/paid) third-party online compilers.
   * This should provide the user the expected output (maybe in a separate dialog) as well as CPU compute time or any other metrics that the compiler can provide.
   * Example: https://www.jdoodle.com/

## Task List Status
 - [ ] "File Browser" like functionality to see & categorize (folders) solutions & offer advanced local Git as well as GitHub integration.
 - [ ] Provision a "snippets" system that allows for user-defined snippets & code (commonly used methods) to be pulled in at will to avoid write-duplication.
 - [ ] Create a tags system to allow for problems & solutions to be tagged (user-defined (eg: easy, hard, leet, tree, graph, array, etc.))
 - [ ] Basic compiler provision (JDoodle as example - allow for any third-party compilers to be used).
 - [ ] Basic GitHub integration (Commit to provided repository).
 - [x] Set basic code editor.
 - [x] Set basic description editor.
 - [x] Pull in the Monaco Editor.
 - [x] Pull in the Bulma CSS framework.
 - [x] Initialize Electron application using Electron Forge.

## Work-In-Progress Screenshot
![code-supposed-to-go-here](https://i.imgur.com/MNHDOGq.png)