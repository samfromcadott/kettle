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
		}
	},
	voices: {},
	playNote: function (note, velocity) {
		var newNote = {}

		for (var node in this.nodes) {
			if (this.nodes.hasOwnProperty(node)) {
				if (node == 'inputFreq') {
					newNote.inputFreq = new Tone.Signal(noteToFreq(note))
				} else {
					newNote[node] = new this.nodes[node].type(this.nodes[node].values)
				}
			}
		}

		for (var currentNode in this.nodes) {
			if (this.nodes.hasOwnProperty(currentNode)) {
				var currentTarget = this.nodes[currentNode].target
				if (currentTarget == 'mixer') {
					newNote[currentNode].connect(this.mixer)
				} else if (Array.isArray(currentTarget)) {
					newNote[currentNode].connect(newNote[currentTarget[0]] [currentTarget[1]])
				} else {
					newNote[currentNode].connect(newNote[currentTarget])
				}
			}
		}

		newNote[0].start()
		newNote[1].triggerAttack(velocity)

		this.voices[note] = newNote
	},
	stopNote: function (note, length) {
		this.voices[note][1].triggerRelease('+' + length)
	}
}

minorScale = [{time: '0:0', length: '4n', note: 57, velocity: 1}, {time: '0:0:3', length: '4n', note: 60, velocity: 1}, {time: '0:0', length: '2n', note: 64, velocity: 1}]

var padPart = new Tone.Part( (time, value) => {
	padSynth.playNote(value.note, value.velocity)
	padSynth.stopNote(value.note, value.length)
}, minorScale).start(0)
