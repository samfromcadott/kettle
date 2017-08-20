const Tone = require('Tone')

exports.audioSamples = new Tone.Buffers({})

function Track(name, type) {
	this.name = name
	this.type = type

	this.pan = new Tone.Panner()
	this.volume = new Tone.Volume()
	this.effects = {}

	this.timeline = new Tone.Part(function (time, value) {
		playClip({start: value.start, length: value.length, data: value.data, loop: value.loop, loopStart: value.loopStart, loopEnd: value.loopEnd})
	}, []).start(0)
}

function AudioTrack (name, type) {
	Track.call(this, name, type) //Inherit from Track()
	this.clipSource = new Tone.Player()

	this.buildTree = function () {
		for (var node in this.effects) {
			if (object.hasOwnProperty(node)) {

			}
		}
	}

	this.playClip = function (clip) {
		this.clipSource.buffer = exports.audioSamples.get(clip.data)
		this.clipSource.retrigger = true

		if (clip.loop == true) { //Things to do for looping audio clips
			this.clipSource.loop = true
			this.clipSource.loopStart = clip.loopStart
			this.clipSource.loopEnd = clip.loopEnd
		}

		this.clipSource.start(0, clip.start, clip.length)
	}
}

function MidiTrack (name, type) {
	Track.call(this, name, type) //Inherit from Track()

	this.notes = {} //Object to

	this.addSource = function (source) {
		this.source = source
	}

	this.playNote = function (noteData) {

	}

	this.playClip = function (clip) {

	}
}

function addTrack (name, type) {
	trackTypes = {
		'audio': AudioTrack,
		'midi': MidiTrack
	}

	var newTrack = new trackTypes [type] (name, type)

	return newTrack
}

exports.addTrack = addTrack

exports.metronome = {
	mode: "off", //This can be 'on', 'off', or 'countdown'
	synth: new Tone.Synth().toMaster(),
	part: new Tone.Part(function(time, note){
		exports.metronome.synth.triggerAttackRelease(note, "16n", time)
	}, [[0, "A4"], ["0:1", "A3"], ["0:2", "A3"], ["0:3", "A3"]]),

	changeMode: function (newMode) {
		console.log('Metronome mode: ', newMode)
		switch (newMode) {
			case "on":
			this.mode = newMode
			this.part.start(0)
			this.part.loop = true
			break;
			case "off":
			this.mode = newMode
			this.part.stop(0)
			break;
			case "countdown":
			this.mode = newMode
			this.part.start(0)
			this.part.loop = false
			break;
			default:
			console.log("Error, Invalid metronome mode: ", newMode)
		}
	}
}

exports.readProject = function (projectJSON) {
	var loadedProject = {}
	loadedProject.tracks = []

	exports.audioSamples = new Tone.Buffers(projectJSON.buffers) //Add audio samples

	for (var i = 0; i < projectJSON.tracks.length; i++) { //Add each track
		var currentTrack = projectJSON.tracks[i]

		loadedProject.tracks[i] = addTrack(currentTrack.name, currentTrack.type)

		for (var j = 0; j < currentTrack.timeline.length; j++) {
			loadedProject.tracks[i].timeline.add(currentTrack.timeline[j])
		}
	}

	return loadedProject
}

exports.play = function () {
	console.log('Transport Started');
	Tone.Transport.start()
	Tone.Master.mute = false
}

exports.stop = function () {
	console.log('Transport Stoped');
	Tone.Transport.stop()
	Tone.Master.mute = true
}

exports.pause = function () {
	console.log('Transport Paused');
	Tone.Transport.pause()
	Tone.Master.mute = true
}
