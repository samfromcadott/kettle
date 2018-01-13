const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

const {ipcMain} = require('electron')
const {dialog} = require('electron')
const {Menu} = require('electron')

import {enableLiveReload} from 'electron-compile'

const path = require('path')
const url = require('url')
const fs = require('fs')

enableLiveReload()

//Window Creation

var windowArray = []
exports.windowCount = 0

function createWindow () {
	// Create the new browser window.
	windowArray.push( new BrowserWindow({width: 800, height: 600}) )
	exports.windowCount = windowArray.length
	var newWindow = windowArray[exports.windowCount-1]

	// windowArray[windowCount-1].maximize()

	// and load the index.html of the app.
	newWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'html/index.html'),
		protocol: 'file:',
		slashes: true
	}))

	// Emitted when the window is closed.
	newWindow.on('closed', function () {
		newWindow = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

// app.on('activate', function () {
// 	// On OS X it's common to re-create a window in the app when the
// 	// dock icon is clicked and there are no other windows open.
// 	if (mainWindow === null) {
// 		createWindow()
// 	}
// })

//Menus

var template = [
	{
		label: 'File',
		submenu: [
			{label: 'New Project'},
			{label: 'Open Project'},
			{label: 'Import File'},
			{type: 'separator'},
			{label: 'Save'},
			{label: 'Save As'},
			{label: 'Settings'}
		]
	},
	{
		label: 'Edit',
		submenu: [
			{role: 'undo'},
			{role: 'redo'},
			{type: 'separator'},
			{role: 'cut'},
			{role: 'copy'},
			{role: 'paste'},
			{role: 'delete'},
			{role: 'selectall'}
		]
	},
	{
		label: 'Window',
		submenu: [
			{label: 'New Window', click: createWindow},
			{role: 'minimize'},
			{type: 'separator'},
			{role: 'toggledevtools'},
			{role: 'close'}
		]
	},
]

var mainMenu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(mainMenu)

//File Functions

function importFile (event) {
	dialog.showOpenDialog({properties: ['openFile', 'multiSelections']}, (filePaths) => {
		console.log(filePaths)
		event.sender.send('importer', filePaths)
	})
}

//IPC Functions

ipcMain.on('window-manager', (event, arg) => {
	console.log(arg)

	if (arg == "New Window") { //Create new window
		createWindow()
	}
})

ipcMain.on('file-manager', (event, arg) => {
	console.log(arg)

	if (arg == "Import Files") {
		importFile(event)
	}
})
