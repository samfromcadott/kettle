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

var fileArray = [] //This is a list of all files recorded or imported

//IPC Functions

ipcRenderer.on('importer', (event, arg) => {
	fileArray = fileArray.concat(arg)

	for (var i = 0; i < arg.length; i++) {
		audio.audioSamples.add(arg[i], arg[i]) //Adds the samples to the buffer
		$('#file-list').append('<li><a>'+arg[i]+'</a></li>')
	}
})

//UI

$('#play').click( () => {
	audio.play()
})

$('#stop').click( () => {
	audio.stop()
})

$('#pause').click( () => {
	audio.pause()
})

$('#import').click( () => {
	ipcRenderer.send('file-manager', 'Import Files')
})

$( "#metronome-checkbox" ).change(function () {
	if (this.checked) {
		audio.metronome.changeMode('on')
	}
	else {
		audio.metronome.changeMode('off')
	}
})

$('#update-program').click( () => {
	var clip = {}
	clip.time = $('#time').val() + 'm'
	clip.buffer = fileArray[ parseInt( $('#sample').val(), 10 ) ]
	clip.start = $('#start').val() + 'm'
	clip.length = $('#length').val() + 'm'
	audioTrack.part.add( clip )
})

//Testing

var testTrack = new audio.Track('Test', 'midi')
testTrack.addSource(new Tone.Synth)
testTrack.part.add( '1m', {notes: [ ['0:1', 'C3'], ['0:2', 'D3'] ]} )

var audioTrack = new audio.Track('Test', 'audio')
// audioTrack.part.add( {time: '1m', buffer: '', start: 0, length: '2m'} )
