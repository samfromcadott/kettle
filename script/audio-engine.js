const Tone = require('Tone')

exports.audioSamples = new Tone.Buffers({})

exports.Track = function (name, type) {
	this.name = name
	this.type = type

	this.audioEffects = []
	this.pan = new Tone.Panner()
	this.volume = new Tone.Volume()
	// this.panVol = new Tone.PanVol()
	this.timeline = [] //This is the events (clips and programing) of the track

	this.updateChain = function () {
		console.log(this.source)
		this.source.chain(this.pan, this.volume, Tone.Master)
	}

	if (type == 'audio') {
		this.source = new Tone.Player()
		this.updateChain()

		this.part = new Tone.Part(function (time, value) {
			this.parent.source.buffer = exports.audioSamples.get(value.buffer)

			if (value.loop == true) { //Things to do for looping audio clips
				this.parent.source.loop = true
				this.parent.source.loopStart = value.loopStart
				this.parent.source.loopEnd = value.loopEnd
			}

			this.parent.source.start(time, value.start, value.length)
		}, []).start(0)

		this.part.parent = this //This is so callback can access the Track object
	}

	if (type == 'midi') {
		this.midiEffects = []
		// this.wrapper = This will be where the wrapper goes

		this.addSource = function (source) {
			this.source = source
			this.updateChain()
		}

		this.addClip = function (clip, start, offset, length) {
			var source = this.source

			var newClip = new Tone.Part(function (time, value) {
				source.triggerAttackRelease(value.note, value.length, time)
			}, clip.notes).start(start, offset)

			if (clip.loop) {
				newClip.loop = true
				newClip.loopStart = clip.loopStart
				newClip.loopEnd = clip.loopEnd
			}

			newClip.stop(Tone.Time(start).add(length))
		}

		// this.part = new Tone.Part(function (time, value) {
		// 	//this.parent.wrapper.play(time, value)
		// 	// this.parent.source.triggerAttackRelease(value.note, value.length, time)
		// 	value.clip.currentTrack = this.parent
		// 	value.clip.start(time, value.offset)
		// 	value.clip.stop(value.length)
		// }, []).start(0)
	}
}

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
