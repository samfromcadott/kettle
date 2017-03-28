const Tone = require('Tone')

var audioSamples = new Tone.Buffers({})

exports.Track = function (name, type) {
	this.name = name
	this.type = type

	this.audioEffects = []
	this.panVol = new Tone.PanVol()
	this.timeline = [] //This is the events (clips and programing) of the track

	this.updateChain = function () {
		this.source.chain(this.panVol, Tone.Master)
	}

	if (type == 'audio') {
		this.source = new Tone.Player()
		this.updateChain()

		this.part = new Tone.Part(function (time, value) {
			this.parent.source.buffer = audioSamples.get(value.buffer)

			if (value.loop == true) { //Things to do for looping audio clips
				this.parent.source.loop = true
				this.parent.source.loopStart = value.loopStart
				this.parent.source.loopEnd = value.loopEnd
			}

			this.parent.source.start(time, value.start, value.length)
		}, []).start(0)
	}

	if (type == 'midi') {
		this.midiEffects = []
		// this.wrapper = This will be where the wrapper goes

		this.addSource = function (source) {
			this.source = source
			this.updateChain()
		}

		this.part = new Tone.Part(function(time, value) {
			new Tone.Part(function (time, value) {
				//this.wrapper.play(time, value)
				// this.source.triggerAttackRelease(value.note, value.length, time)
				console.log(value)
			}, value.notes).start(time)
		}, []).start(0)
	}

	this.part.parent = this //This is so callback can access the Track object
}

// IDEA: There can be an 'instrument rapper' class that does the note number to frequency work and can manage multi-node and multi-source instruments

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

exports.play = function () {
	console.log('Transport Started');
	Tone.Transport.start()
}
