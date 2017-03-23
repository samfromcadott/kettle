const Tone = require('Tone')

exports.Track = function (name, type) {
	this.name = name
	this.type = type

	this.audioEffects = []
	this.panVol = new Tone.PanVol()

	this.addSource = function (source) {
		this.source = source
		this.updateChain()
	}

	this.updateChain = function () {
		this.source.chain(this.panVol, Tone.Master)
	}

	// if (type == 'audio') {
	//
	// }
	//
	// if (type == 'midi') {
	//
	// }
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
}
