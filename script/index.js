//Renderer process for main window
var $ = require('jQuery')
const electron = require('electron')
const {remote} = electron
const {Menu}  = remote.require('electron')
const {ipcRenderer} = require('electron')
const main = remote.require('./main')
const Tone = require('Tone')
const audio = require('./audio-engine')

console.log("Node.js version: ", process.versions.node)
console.log("Chromium version: ", process.versions.chrome)
console.log("Electron version: ", process.versions.electron)

$('#play').click(function() {
	audio.play()
})

$( "#metronome-checkbox" ).change(function () {
	if (this.checked) {
		audio.metronome.changeMode('on')
	}
	else {
		audio.metronome.changeMode('off')
	}
})

var testTrack = new audio.Track('Test', 'midi')
testTrack.addSource(new Tone.Synth)
testTrack.part.add( '1m', {notes: [ ['0:1', 'C3'], ['0:2', 'D3'] ]} )

var audioTrack = new audio.Track('Test', 'audio')
