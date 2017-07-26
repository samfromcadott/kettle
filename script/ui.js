window.$ = window.jQuery = require('jquery')
require('../node_modules/jquery-ui-dist/jquery-ui.js')

const electron = require('electron')
const {remote} = electron
const {Menu}  = remote.require('electron')
const fs = require('fs')

exports.loadUIPlugin = function (pluginData, targetDiv) {
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
