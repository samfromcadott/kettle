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

function getFileName(filepath) {
	filepath = filepath.replace(/\\/g,"\/") //Convert Windows paths to UNIX
	filepath = filepath.split('\/') //Split directoies
	return filepath[filepath.length - 1]
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
	clip.buffer = getFileName(fileArray[ parseInt( $('#sample').val(), 10 ) ])
	clip.start = $('#start').val() + 'm'
	clip.length = $('#length').val() + 'm'
	audioTrack.part.add( clip )
})

//Testing

var testClip = {
	name: "Test Clip",
	loop: true,
	loopStart: '0:0',
	loopEnd: '2:0',
	notes: [
		{time: '0:0', note: 'C3', length: '4n'},
		{time: '0:1', note: 'D3', length: '4n'},
		{time: '0:2', note: 'E3', length: '4n'},
		{time: '0:3', note: 'F3', length: '4n'},
		{time: '1:0', note: 'G3', length: '4n'},
		{time: '1:1', note: 'A3', length: '4n'},
		{time: '1:2', note: 'B3', length: '4n'},
		{time: '1:3', note: 'C4', length: '4n'}]
}

var testTrack = new audio.Track('Test', 'midi')
testTrack.addSource(new Tone.PolySynth(6, Tone.Synth))
testTrack.addClip(testClip, '0:0'/*Start*/, '0:0'/*Offset*/, '3:0'/*Length*/)

var audioTrack = new audio.Track('Test', 'audio')
