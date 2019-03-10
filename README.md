# code-goes-here

An App to practice programming.

## Built With

 * [Electron](https://electronjs.org/),
   A framework for creating native applications using web technologies to build cross-platform desktop applications.
 * [Bulma](https://bulma.io),
   A light-weight, modular CSS framework.
 * [Monaco Editor](https://github.com/Microsoft/monaco-editor), A browser based code editor that powers [VSCode](https://github.com/Microsoft/vscode).

## Usage

 * Install nodejs (https://nodejs.org/en/download/)
 * Install Electron Forge (`npm install -g electron-forge`)
 * git clone https://github.com/1nv1n/code-goes-here.git
 * Switch to the cloned directory & run:
   * `npm install`
   * `npm start`
 * *(Optional)* Register for an account at [JDoodle](https://www.jdoodle.com/compiler-api) & get your Client ID & Secret. Set these through App's "Settings"
 * *(Optional)* Create a personal access token at [GitHub](https://github.com/settings/tokens). Set this through the App's settings.

## Project Goals

 * A dual editor system to practice programming.
   * An editor to describe the practice problem & another to code the solution.
 * Compile code using an online compiler to generate the output & provide statistics.
 * Download & commit back to GitHub.

## Features

 - [ ] "File Browser" like functionality to see & categorize (folders) solutions & offer advanced local Git as well as GitHub integration.
 - [ ] Provision a "snippets" system that allows for user-defined snippets & code (commonly used methods) to be pulled in at will to avoid write-duplication.
 - [ ] Create a tags system to allow for problems & solutions to be tagged (user-defined (eg: easy, hard, leet, tree, graph, array, etc.)).
 - [ ] Add in customizable "timer".
 - [ ] Advanced/multiple third-party compiler integration.
 - [x] LeetCode integration.
 - [x] Basic compiler provision (JDoodle).
 - [x] Basic GitHub integration (Commit to provided repository).
 - [x] Basic HTTP "download" of description & solution (eg: Raw content from GitHub).
 - [x] Set basic code editor (Monaco).
 - [x] Set basic description editor (Monaco).
 - [x] Pull in the Monaco Editor.
 - [x] Pull in the Bulma CSS framework.
 - [x] Initialize Electron application using Electron Forge.

## Work-In-Progress Screenshot
![code-goes-here](https://i.imgur.com/UboGZeV.png)
