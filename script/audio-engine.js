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
	Track.call(this, name, type)
	this.source = new Tone.Player()

	this.playClip = function (clip) {
		this.source.buffer = exports.audioSamples.get(clip.data)
		this.source.retrigger = true

		if (clip.loop == true) { //Things to do for looping audio clips
			this.source.loop = true
			this.source.loopStart = clip.loopStart
			this.source.loopEnd = clip.loopEnd
		}

		this.source.start(0, clip.start, clip.length)
	}
}

function MidiTrack (name, type) {
	Track.call(this, name, type)

	this.addSource = function (source) {
		this.source = source
	}

	this.playClip = function (clip) {

	}
}

function addTrack (name, type) {
	trackTypes = {
		'audio': AudioTrack,
		'midi': MidiTrack
	}

	newTrack = new trackTypes [type] (name, type)

	return newTrack
}

exports.addTrack = addTrack

// exports.Track = function (name, type) {
// 	this.name = name
// 	this.type = type
//
// 	this.audioEffects = []
// 	this.pan = new Tone.Panner()
// 	this.volume = new Tone.Volume()
// 	this.timeline = [] //This is the events (clips and programing) of the track
//
// 	this.updateChain = function () {
// 		if (this.audioEffects.length >= 1) {
// 			this.source.connect(this.audioEffects[0])
// 			for (var i = 0; i < this.audioEffects.length - 1; i++) {
// 				this.audioEffects[i].connect(this.audioEffects[i + 1])
// 			}
// 			this.audioEffects[this.audioEffects.length - 1].chain(this.pan, this.volume, Tone.Master)
// 		}
// 		else {
// 			this.source.chain(this.pan, this.volume, Tone.Master)
// 		}
// 	}
//
// 	if (type == 'audio') {
// 		this.source = new Tone.Player()
// 		this.updateChain()
//
// 		this.part = new Tone.Part(function (time, value) {
// 			this.parent.source.buffer = exports.audioSamples.get(value.buffer)
// 			this.parent.source.retrigger = true
//
// 			if (value.loop == true) { //Things to do for looping audio clips
// 				this.parent.source.loop = true
// 				this.parent.source.loopStart = value.loopStart
// 				this.parent.source.loopEnd = value.loopEnd
// 				this.parent.source.stop(value.length)
// 			}
//
// 			this.parent.source.start(time, value.start, value.length)
// 		}, []).start(0)
//
// 		this.part.parent = this //This is so callback can access the Track object
// 	}
//
// 	if (type == 'midi') {
// 		this.midiEffects = []
// 		// this.wrapper = This will be where the wrapper goes
//
// 		this.addSource = function (source) {
// 			this.source = source
// 			this.updateChain()
// 		}
//
// 		this.addClip = function (clip, start, offset, length) {
// 			var source = this.source
//
// 			var newClip = new Tone.Part(function (time, value) {
// 				source.triggerAttackRelease(value.note, value.length, time)
// 			}, clip.notes).start(start, offset)
//
// 			if (clip.loop) {
// 				newClip.loop = true
// 				newClip.loopStart = clip.loopStart
// 				newClip.loopEnd = clip.loopEnd
// 			}
//
// 			newClip.stop(Tone.Time(start).add(length))
// 		}
//
// 		// this.part = new Tone.Part(function (time, value) {
// 		// 	//this.parent.wrapper.play(time, value)
// 		// 	// this.parent.source.triggerAttackRelease(value.note, value.length, time)
// 		// 	value.clip.currentTrack = this.parent
// 		// 	value.clip.start(time, value.offset)
// 		// 	value.clip.stop(value.length)
// 		// }, []).start(0)
// 	}
// }

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
	console.log(projectJSON)
	console.log(projectJSON.tracks)

	var loadedProject = {}
	loadedProject.tracks = []

	exports.audioSamples = new Tone.Buffers(projectJSON.buffers) //Add audio samples

	for (var i = 0; i < projectJSON.tracks.length; i++) { //Add each track
		var currentTrack = projectJSON.tracks[i]

		loadedProject.tracks[i] = new exports.Track(currentTrack.name, currentTrack.type)
		loadedProject.tracks[i].timeline = currentTrack.timeline

		for (var j = 0; j < currentTrack.timeline.length; j++) {
			loadedProject.tracks[i].part.add(currentTrack.timeline[j])
		}
	}

	console.log(loadedProject)
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
