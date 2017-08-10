require('./index') //This is so plugins can use varaibles defined in index.js

window.$ = window.jQuery = require('jquery')
require('../node_modules/jquery-ui-dist/jquery-ui.js')

const electron = require('electron')
const {remote} = electron
const {Menu, MenuItem} = remote

// Right click menu

var rightClickTemplate = [
	{label: 'Split Up', click() { console.log('Split Up') }},
	{label: 'Split Down', click() { console.log('Split Down') }},
	{label: 'Split Left', click() { console.log('Split Left') }},
	{label: 'Split Right', click() { console.log('Split Right') }},
	{label: 'Close Panel', click() { console.log('Panel Closed') }},
]

$('body').contextmenu( (event) => {
	event.preventDefault() //Prevent predefined menu for appearing

	var rightClickMenu = Menu.buildFromTemplate(rightClickTemplate)
	rightClickMenu.popup(remote.getCurrentWindow()) //Show the menu
})

exports.rightClickTemplate = rightClickTemplate

// User Messages

exports.displayMessage = function (type, head, body) {
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

	var closeButton = $('<div/>', { //Close button
		class: 'message-close',
		html: '&times;',
		appendTo: messageHead, //Add to title bar
		click: () => {newMessage.remove()}
	})

	newMessage.prependTo('#message-area') //Add to start of message area
	setTimeout(() => {newMessage.remove()}, 20000) //Remove after 20 seconds
}
