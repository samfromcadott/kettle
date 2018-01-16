//Renderer process for main window
window.$ = window.jQuery = require('jquery')
require('jquery-ui-dist/jquery-ui.js')

const electron = require('electron')
const {remote} = electron
const {Menu}  = remote.require('electron')
const {ipcRenderer} = require('electron')

import Vue from 'vue/dist/vue.js'
const Tone = require('Tone')
const fs = require('fs')
const path = require('path')

const main = remote.require('./main')
const audio = require('./audio-engine')
const ui = require('./ui')

loadUIPlugin('song-editor')

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

function getPluginData(pluginPath) {
	var pluginData = JSON.parse( fs.readFileSync(path.join(pluginPath, 'plugin.json'), 'utf-8') )

	return pluginData

}

function loadUIPlugin (pluginName) {
	var pluginPath = path.join(__dirname, '../core-plugins', pluginName)

	var pluginData = getPluginData(pluginPath)

	var vueFile = path.join(pluginPath, pluginData['file'])

	Vue.component(pluginName, require(vueFile))

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

//Vue App

var mainWindow = new Vue({
	el: '#window-body'
})
