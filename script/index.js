//Renderer process for main window
window.$ = window.jQuery = require('jquery')
require('../node_modules/jquery-ui-dist/jquery-ui.js')

const electron = require('electron')
const {remote} = electron
const {Menu}  = remote.require('electron')
const {ipcRenderer} = require('electron')

const Vue = require('vue')
const Tone = require('Tone')
const fs = require('fs')
const path = require('path')

const main = remote.require('./main')
const audio = require('./audio-engine')
const ui = require('./ui')

var fileArray = [] //This is a list of all files recorded or imported
var pluginList = [
	{name: 'Song Editor', file: 'song-editor'}
]

exports.pluginList = pluginList

function getFileName(filepath) {
	filepath = filepath.replace(/\\/g,"\/") //Convert Windows paths to UNIX
	filepath = filepath.split('\/') //Split directoies
	return filepath[filepath.length - 1] //Return test after last slash
}

function getPluginData(pluginName) {
	var pluginPath = path.join(__dirname, '../core-plugins', pluginName)

	var pluginData = JSON.parse( fs.readFileSync(path.join(pluginPath, 'plugin.json'), 'utf-8') )

	// This is to replace relative paths with absolute
	if (pluginData.hasOwnProperty('htmlFile')) {
		pluginData.htmlFile = path.join(pluginPath, pluginData.htmlFile)
	}
	if (pluginData.hasOwnProperty('javaScriptFile')) {
		pluginData.javaScriptFile = path.join(pluginPath, pluginData.javaScriptFile)
	}

	return pluginData
}

function loadUIPlugin (pluginData, targetDiv) {
	//Load HTML file
	$(targetDiv).load(pluginData.htmlFile)

	//Run the plugin script
	fs.readFile(pluginData.javaScriptFile, 'utf-8', function (err, data) {
		if (!err) {
			eval(data)
		} else {
			console.log(err)
		}
	})
}

function loadProject(filepath) {
	// fs.readFileSync(filepath, 'utf-8', function (err, data) {
	// 	if (!err) {
	// 		currentProject = audio.readProject( JSON.parse(data) )
	// 	} else {
	// 		displayMessage('error', 'Cannot Load Project', 'Could not open file:' + filepath)
	// 	}
	// })

	var data = fs.readFileSync(filepath, 'utf-8')
	return audio.readProject( JSON.parse(data) )
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

$('#import').click( () => {
	ipcRenderer.send('file-manager', 'Import Files')
})

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
		{time: '1:3', note: noteToFreq(60), length: '4n'}
	]
}

// var testTrack = new audio.Track('Test', 'midi')
// testTrack.addSource(new Tone.PolySynth(6, Tone.Synth))
// testTrack.addClip(testClip, '0:0'/*Start*/, '0:0'/*Offset*/, '2:0'/*Length*/)

// var audioTrack = new audio.Track('Test', 'audio')

// displayMessage('info', 'Test', 'Testing... Testing... 1, 2, 3...')
// displayMessage('success', 'Alerts Working', 'User messages work.')
// displayMessage('warning', 'Alert', 'Something might be going wrong.')
// displayMessage('error', 'Error', 'Something probably went wrong.')

// Angular App

// var currentProject = loadProject('./example-project.json')
//
// var app = angular.module('mainWindow', [])
//
// app.controller('mainController', function($scope) {
// 	$scope.currentProject = currentProject  //The object containing all current project information
// 	console.log($scope.currentProject)
// })
//
// angular.module('mainWindow').directive('panel', function() {
// 	return ui.panelDirective
// })
//
// exports.app = app


// loadUIPlugin(getPluginData('song-editor'), '#window-body')
