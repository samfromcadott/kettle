Tone.Transport.stop()

$('#play-button').click( () =>{
	if (Tone.Transport.state == "stopped") {
		Tone.Transport.start()
		$('#play-button').html('&#9724;')
	} else if (Tone.Transport.state == "started") {
		Tone.Transport.stop()
		$('#play-button').html('&#9658;')
	}
})

function noteToFreq(note) {
	return 2**((note-69)/12) * 440
}

function MidiTrack(nodes) {
	this.mixer = new Tone.PanVol(0, 0).toMaster()
	this.nodes = nodes
	this.voices = {}

	this.playNote = function (note, velocity) {

	}

	this.stopNote = function (note, length) {

	}
}

var padSynth = {
	mixer: new Tone.PanVol(0, 0).toMaster(),
	nodes: {
		inputFreq: {
			target: [0, 'frequency']
		},
		0: {
			type: Tone.Oscillator,
			values: {
				type: 'sawtooth'
			},
			target: 1
		},
		1: {
			type: Tone.AmplitudeEnvelope,
			values: {},
			target: 'mixer'
		},
		2: {
			type: Tone.ScaledEnvelope,
			values: {
				min: -1200,
				max: 1200,
				attack: 0.6,
				decay: 0.1,
				sustain: 0,
			},
			target: [0, 'detune']
		}
	},
	voices: {},
	playNote: function (note, velocity) {
		var newNote = {}

		for (var currentNode in this.nodes) {
			if (this.nodes.hasOwnProperty(currentNode)) {
				if (currentNode == 'inputFreq') {
					newNote.inputFreq = new Tone.Signal(noteToFreq(note))
				} else {
					newNote[currentNode] = new this.nodes[currentNode].type(this.nodes[currentNode].values)
				}
			}
		}

		for (var currentNode in this.nodes) {
			if (this.nodes.hasOwnProperty(currentNode)) {
				var currentTarget = this.nodes[currentNode].target
				if (currentTarget == 'mixer') {
					newNote[currentNode].connect(this.mixer)
				} else if (Array.isArray(currentTarget)) {
					console.log(currentNode + ': ' + currentTarget)
					newNote[currentNode].connect(newNote[currentTarget[0]] [currentTarget[1]])
				} else {
					newNote[currentNode].connect(newNote[currentTarget])
				}
			}
		}

		for (var currentNode in newNote) {
			if (newNote.hasOwnProperty(currentNode)) {
				if (typeof newNote[currentNode].start === 'function') {
					newNote[currentNode].start()
				} else if (typeof newNote[currentNode].triggerAttack === 'function') {
					newNote[currentNode].triggerAttack()
				}
			}
		}

		this.voices[note] = newNote
	},
	stopNote: function (note, length) {
		for (var currentNode in this.voices[note]) {
			if (this.voices[note].hasOwnProperty(currentNode)) {
				if (typeof this.voices[note][currentNode].triggerRelease === 'function') {
					this.voices[note][currentNode].triggerRelease('+' + length)
				}
			}
		}
	}
}

minorScale = [{time: '0:0', length: '4n', note: 57, velocity: 1},{time: '0:1', length: '4n', note: 59, velocity: 1}]

var padPart = new Tone.Part( (time, value) => {
	padSynth.playNote(value.note, value.velocity)
	padSynth.stopNote(value.note, value.length)
}, minorScale).start(0)
