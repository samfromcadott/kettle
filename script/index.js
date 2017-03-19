//Renderer process for main window
var $ = require('jQuery')
const electron = require('electron')
const {remote} = electron
const {Menu}  = remote.require('electron')
const {ipcRenderer} = require('electron')
const main = remote.require('./main')
const Tone = require('Tone')

// //Check to see if this is the first window
// if (main.windowCount == 0) { //windowCount isn't increased until after creation
// 	console.log(main.windowCount)
// 	const Tone = require('Tone') //Only one instance of Tone should be created
// }

console.log("Node.js version: ", process.versions.node)
console.log("Chromium version: ", process.versions.chrome)
console.log("Electron version: ", process.versions.electron)

// $('#new-window').click(function() {
// 	ipcRenderer.send('window-manager', 'New Window')
// })
