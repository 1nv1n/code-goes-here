(function () {
  const path = require('path');
  const amdLoader = require('../node_modules/monaco-editor/min/vs/loader.js');
  const amdRequire = amdLoader.require;
  const amdDefine = amdLoader.require.define;

  function uriFromPath(_path) {
    let pathName = path.resolve(_path).replace(/\\/g, '/');
    if (pathName.length > 0 && pathName.charAt(0) !== '/') {
      pathName = '/' + pathName;
    }
    return encodeURI('file://' + pathName);
  }

  amdRequire.config({
    baseUrl: uriFromPath(path.join(__dirname, '../node_modules/monaco-editor/min')),
  });

  // workaround monaco-css not understanding the environment
  self.module = undefined;

  amdRequire(['vs/editor/editor.main'], function () {
    let editor = monaco.editor.create(document.getElementById('monCodeEditor'), {
      automaticLayout: true, // This incurs some performance cost
      value: [
        'public void greet() {',
        '\tSystem.out.println("Hello from Monaco!");',
        '}',
      ].join('\n'),
      language: 'java',
      scrollBeyondLastLine: false,
      theme: 'vs-dark',
    });
  });
})();
