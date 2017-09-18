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
	this.timeline = [{time: '0:0', length: '4n', note: 57, velocity: 0.8},{time: '0:0:1', length: '4n', note: 52, velocity: 0.8},{time: '0:1', length: '0:2', note: 61, velocity: 0.3}, {time: '1:0', length: '4n', note: 62, velocity: 1}, {time: '1:0:1', length: '4n', note: 62, velocity: 1}]
	this.part = new Tone.Part( (time, value) => {
		this.playNote(value.note, value.velocity)
		this.stopNote(value.note, value.length)
	}, this.timeline).start(0)

	this.playClip = function (clip) {
		return new Tone.Part( (time, value) => {
			this.playNote(value.note, value.velocity)
			this.stopNote(value.note, value.length)
		}, clip).start()
	}

	function makeNodes(nodeTree, currentNode, newNote, note) {
		if (nodeTree.hasOwnProperty(currentNode) && nodeTree[currentNode].retrigger != false) {
			if (currentNode == 'inputFreq') {
				newNote.inputFreq = new Tone.Signal(noteToFreq(note))
			} else {
				newNote[currentNode] = new nodeTree[currentNode].type(nodeTree[currentNode].values)
			}
		}
		if (nodeTree.hasOwnProperty(currentNode) && nodeTree[currentNode].retrigger == false) {
				newNote[currentNode] = this[currentNode]
		}
	}

	function connectNodes(nodeTree, currentNode, newNote) {
		if (nodeTree.hasOwnProperty(currentNode)) {
			var currentTarget = nodeTree[currentNode].target
			if (currentTarget == 'mixer') {
				newNote[currentNode].connect(newNote.velocity)
			} else if (Array.isArray(currentTarget)) {
				if (Array.isArray(currentTarget[0])) {
					for (var i = 0; i < currentTarget.length; i++) {
						newNote[currentNode].connect( newNote[currentTarget[i][0]] [currentTarget[i][1]] )
					}
				} else {
					newNote[currentNode].connect(newNote[currentTarget[0]] [currentTarget[1]])
				}
			} else {
				newNote[currentNode].connect(newNote[currentTarget])
			}
		}
	}

	function startNodes(currentNode, newNote) {
		if (newNote.hasOwnProperty(currentNode)) {
			if (typeof newNote[currentNode].start === 'function') {
				newNote[currentNode].start()
			} else if (typeof newNote[currentNode].triggerAttack === 'function') {
				newNote[currentNode].triggerAttack()
			}
		}
	}

	for (var currentNode in this.nodes) {
		if (this.nodes.hasOwnProperty(currentNode)) {
			if (this.nodes[currentNode].retrigger == false) {
				this[currentNode] = new this.nodes[currentNode].type(this.nodes[currentNode].values)
			}
		}
	}

	this.playNote = function (note, velocity) {
		var newNote = {}
		newNote.velocity = new Tone.Gain(velocity).connect(this.mixer)

		for (var currentNode in this.nodes) makeNodes(this.nodes, currentNode, newNote, note)
		for (var currentNode in this.nodes) connectNodes(this.nodes, currentNode, newNote)
		for (var currentNode in newNote) startNodes(currentNode, newNote)

		this.voices[note] = newNote
	}

	this.stopNote = function (note, length) {
		for (var currentNode in this.voices[note]) {
			if (this.voices[note].hasOwnProperty(currentNode)) {
				if (typeof this.voices[note][currentNode].triggerRelease === 'function') {
					this.voices[note][currentNode].triggerRelease('+' + length)
				}
			}
		}
	}
}

var padSynth = new MidiTrack({
	inputFreq: {
		target: [[0, 'frequency'],[3, 'frequency']]
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
		target: 4
	},
	2: {
		type: Tone.ScaledEnvelope,
		values: {
			min: -50,
			max: 25,
			attack: 0.6,
			decay: 0.1,
			sustain: 0,
		},
		target: [0, 'detune']
	},
	3: {
		type: Tone.Oscillator,
		values: {
			type: 'sine',
			detune: 1200
		},
		target: 1
	},
	4: {
		type: Tone.AutoFilter,
		values: {
			frequency: 20
		},
		target: 'mixer'
	}
})

minorScale = [{time: '0:0', length: '4n', note: 57, velocity: 0.8},{time: '0:0:1', length: '4n', note: 52, velocity: 0.8},{time: '0:1', length: '0:2', note: 61, velocity: 0.3}, {time: '1:0', length: '4n', note: 62, velocity: 1}, {time: '1:0:1', length: '4n', note: 62, velocity: 1}]

padSynth.playClip(minorScale)

// var padPart = new Tone.Part( (time, value) => {
// 	padSynth.playNote(value.note, value.velocity)
// 	padSynth.stopNote(value.note, value.length)
// }, minorScale).start(0)
