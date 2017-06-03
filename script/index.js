//Renderer process for main window
window.$ = window.jQuery = require('jquery')
require('../node_modules/jquery-ui-dist/jquery-ui.js')

const electron = require('electron')
const {remote} = electron
const {Menu}  = remote.require('electron')
const {ipcRenderer} = require('electron')
const main = remote.require('./main')
const Tone = require('Tone')
const audio = require('./audio-engine')
const fs = require('fs')
const path = require('path')

console.log("Node.js version: ", process.versions.node)
console.log("Chromium version: ", process.versions.chrome)
console.log("Electron version: ", process.versions.electron)

var fileArray = [] //This is a list of all files recorded or imported

function getFileName(filepath) {
	filepath = filepath.replace(/\\/g,"\/") //Convert Windows paths to UNIX
	filepath = filepath.split('\/') //Split directoies
	return filepath[filepath.length - 1] //Return test after last slash
}

function loadUIPlugin(pluginName) {
	var targetDiv = $('<div/>') //Create the div for the plugin
	var pluginPath = path.join(__dirname, '../core-plugins', pluginName)

	//Get the 'plugin.json' file
	var pluginInfo = JSON.parse( fs.readFileSync(path.join(pluginPath, 'plugin.json'), 'utf-8') )

	//Load plugin HTML
	$(targetDiv).load(path.join(pluginPath, pluginInfo.htmlFile))

	$(targetDiv).appendTo('body') //Add the plugin div to the window

	//Run the plugin script
	fs.readFile(path.join(pluginPath, pluginInfo.javaScriptFile), 'utf-8', function (err, data) {
		if (!err) {
			eval(data)
		} else {
			console.log(err)
		}
	})
}

//IPC Functions

ipcRenderer.on('importer', (event, arg) => {
	fileArray = fileArray.concat(arg)

	for (var i = 0; i < arg.length; i++) {
		audio.audioSamples.add(getFileName(arg[i]), arg[i]) //Adds samples to buffer
		$('#file-list').append('<li><a>'+getFileName(arg[i])+'</a></li>')
	}
})

//UI

loadUIPlugin('song-editor')

$('#import').click( () => {
	ipcRenderer.send('file-manager', 'Import Files')
})

function displayMessage(type, head, body) {
	var newMessage = $('<div/>', { //Message window
		class: 'message-box ' + type
	})

	var messageHead = $('<div/>', { //Message title bar
		class: 'message-head',
		html: head,
		appendTo: newMessage //Add to window
	})

	var messageBody = $('<div/>', { //Message content
		class: 'message-body',
		html: body,
		appendTo: newMessage //Add to window
	})

	var closeButton = $('<button/>', { //Close button
		class: 'message-close',
		html: '&times;',
		appendTo: messageHead, //Add to title bar
		click: () => {newMessage.remove()}
	})

	newMessage.prependTo('#message-area') //Add to start of message area
	setTimeout(() => {newMessage.remove()}, 20000) //Remove after 20 seconds
}

//Testing

function noteToFreq(note) {
	return 2**((note-69)/12) * 440
}

var testClip = {
	name: "Test Clip",
	// loop: true,
	// loopStart: '0:0',
	// loopEnd: '2:0',
	notes: [
		{time: '0:0', note: noteToFreq(48), length: '4n'},
		{time: '0:1', note: noteToFreq(50), length: '4n'},
		{time: '0:2', note: noteToFreq(52), length: '4n'},
		{time: '0:3', note: noteToFreq(53), length: '4n'},
		{time: '1:0', note: noteToFreq(55), length: '4n'},
		{time: '1:1', note: noteToFreq(57), length: '4n'},
		{time: '1:2', note: noteToFreq(59), length: '4n'},
		{time: '1:3', note: noteToFreq(60), length: '4n'}]
}

var testTrack = new audio.Track('Test', 'midi')
testTrack.addSource(new Tone.PolySynth(6, Tone.Synth))
// testTrack.addClip(testClip, '0:0'/*Start*/, '0:0'/*Offset*/, '2:0'/*Length*/)

var audioTrack = new audio.Track('Test', 'audio')

// displayMessage('warning', 'Test', 'Testing... Testing... 1, 2, 3...')
