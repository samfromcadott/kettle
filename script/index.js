//Renderer process for main window
var $ = require('jQuery')

console.log("Node.js version: ", process.versions.node)
console.log("Chromium version: ", process.versions.chrome)
console.log("Electron version: ", process.versions.electron)

$("body").append("<p>Testing to see if render process working.</p>")
