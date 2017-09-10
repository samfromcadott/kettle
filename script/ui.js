const index = require('./index') //This is so plugins can use varaibles defined in index.js

window.$ = window.jQuery = require('jquery')
require('../node_modules/jquery-ui-dist/jquery-ui.js')

const electron = require('electron')
const {remote} = electron
const {Menu, MenuItem} = remote
const Vue = require('vue/dist/vue.js')


var activeElement, activePanel

$('body').mousemove( (event) => {
	activeElement = event.target
})

$('panel').mousemove( (event) => {
	activePanel = event.target
})

// Right click menu

var rightClickLocation = {}

var rightClickTemplate = [
	{label: 'Select Panel', submenu: []},
	{label: 'Split Panel', click() { spitPanel(activePanel) }},
	{label: 'Close Panel', click() { activePanel.remove() }}
]

function makeRightClickTemplate() {
	var selectPanelMenu = []
	for (var i = 0; i < index.pluginList.length; i++) {
		selectPanelMenu.push({ label: index.pluginList[i].name, click() {choosePanel(activePanel, index.pluginList[i].file)} })
	}

	return [{label: 'Select Panel', submenu: selectPanelMenu},{label: 'Split Panel', click() { spitPanel(activePanel) }},{label: 'Close Panel', click() { activePanel.remove() }}]
}

$('body').contextmenu( (event) => {
	event.preventDefault() //Prevent predefined menu for appearing
	rightClickLocation = {x: event.pageX, y: event.pageY} //Store location user clicks

	var rightClickMenu = Menu.buildFromTemplate(rightClickTemplate)
	rightClickMenu.popup(remote.getCurrentWindow()) //Show the menu
})

exports.rightClickTemplate = rightClickTemplate

// Panel system

function spitPanel(panel) {
	var angle
	var panelMask = $('<div/>', {
		id: 'panel-mask',
		appendTo: panel
	})

	var moveHandler = function (event) {
		angle = Math.atan2(event.pageY - rightClickLocation.y, event.pageX - rightClickLocation.x) * 180 / Math.PI

		if (angle >= -45 && angle < 45) { //Right
			$(panelMask).css({
				'top': '0%',
				'left': '50%',
				'width': '50%',
				'height': '100%'
			})
		}
		if (angle >= 45 && angle < 135) { //Down
			$(panelMask).css({
				'top': '50%',
				'left': '0%',
				'width': '100%',
				'height': '50%'
			})
		}
		if (angle >= 135 || angle < -135) { //Left
			$(panelMask).css({
				'top': '0%',
				'left': '0%',
				'width': '50%',
				'height': '100%'
			})
		}
		if (angle >= -135 && angle < -45) { //Up
			$(panelMask).css({
				'top': '0%',
				'left': '0%',
				'width': '100%',
				'height': '50%'
			})
		}
	}

	$('*').click( () => {
		$(panelMask).remove()
		$('body').unbind('mousemove', moveHandler)
	})

	$('body').bind('mousemove', moveHandler)
}

function choosePanel(panel, type) {
	loadUIPlugin(getPluginData(type), panel)
}

exports.panelDirective = {
	template : function (elem, attr) {
		return 'This is a panel'
	}
}

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
