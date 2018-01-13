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

import songEditor from '../core-plugins/song-editor/song-editor.vue'
Vue.component('song-editor', songEditor)

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
	// //Load HTML file
	// $(targetDiv).load(pluginData.htmlFile)
	//
	// //Run the plugin script
	// fs.readFile(pluginData.javaScriptFile, 'utf-8', function (err, data) {
	// 	if (!err) {
	// 		eval(data)
	// 	} else {
	// 		console.log(err)
	// 	}
	// })
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
