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

	this.voices = {} //All active notes
	this.timeline = [] //This is an array of clips in the track

	this.part = new Tone.Part( (time, value) => {
		this.playClip(value)
	}, this.timeline).start(0)

	this.playClip = function (clip) {
		return new Tone.Part( (time, value) => {
			this.playNote(value.note, value.velocity)
			this.stopNote(value.note, value.length)
		}, clip).start()
	}

	function connectNode(currentNode, currentTarget, newNote) {
		if (currentTarget == 'mixer') { //When the target is the mixer
			newNote[currentNode].connect(newNote.velocity) //Connect to velocity node

		} else if (typeof currentTarget === 'object') { //When the target is specific input
			newNote[currentNode].connect( newNote[currentTarget.node][currentTarget.value] )

		} else {
			newNote[currentNode].connect(newNote[currentTarget])

		}
	}

	//Create non-retriggering nodes
	for (var currentNode in this.nodes) {
		if (this.nodes.hasOwnProperty(currentNode)) { //Iterate over node tree

			if (this.nodes[currentNode].retrigger == false) { //If the node doesn't retrigger
				this[currentNode] = new this.nodes[currentNode].type(this.nodes[currentNode].values)

			}

		}
	}

	this.playNote = function (note, velocity) {
		var newNote = {} //Node tree of the new note
		newNote.velocity = new Tone.Gain(velocity).connect(this.mixer)

		//Make nodes
		for (var currentNode in this.nodes) {
			if ( this.nodes.hasOwnProperty(currentNode) ) { //Iterate over node tree

				if (currentNode == 'inputFreq') { //inputFreq is a signal carrying current note frequency
					newNote.inputFreq = new Tone.Signal(noteToFreq(note)) //Create signal

				} else if (this.nodes[currentNode].retrigger != false) { //When the node retriggers
					//Create a node with the type of currentNode
					newNote[currentNode] = new this.nodes[currentNode].type(this.nodes[currentNode].values)

				} else if (this.nodes[currentNode].retrigger == false) { //When the node doesn't retrigger
					newNote[currentNode] = this[currentNode] //Create a pointer to the node

				}

			}
		}

		//Connect nodes
		for (var currentNode in this.nodes) {
			if ( this.nodes.hasOwnProperty(currentNode) ) { //Iterate over node tree

				var currentTarget = this.nodes[currentNode].target //currentNode's target

				if ( Array.isArray(currentTarget) ) { //If there are multiple targets
					for (var i = 0; i < currentTarget.length; i++) { //Iterate over target array
						connectNode(currentNode, currentTarget[i], newNote)

					}
				} else { //If there is a single target
					connectNode(currentNode, currentTarget, newNote)

				}
			}
		}

		//Start nodes
		for (var currentNode in newNote) {
			if (newNote.hasOwnProperty(currentNode)) { //Iterate over node tree in newNote

				if (typeof newNote[currentNode].start === 'function') { //If the node has a start function
					newNote[currentNode].start()

				} else if (typeof newNote[currentNode].triggerAttack === 'function') {
					//If the node has a triggerAttack function
					newNote[currentNode].triggerAttack()

				}
			}
		}

		this.voices[note] = newNote //Add newNote to voices
	}

	this.stopNote = function (note, length) {
		//Find all envelopes and release them
		for (var currentNode in this.voices[note]) {
			if (this.voices[note].hasOwnProperty(currentNode)) { //Iterate over node in note that's ending

				if (typeof this.voices[note][currentNode].triggerRelease === 'function') {
					//triggerRelease and node that has the function
					this.voices[note][currentNode].triggerRelease('+' + length)

				}

			}
		}
	}

}

var padSynth = new MidiTrack({
	inputFreq: {
		target: [{node: 0, value: 'frequency'}, {node: 3, value: 'frequency'}]
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
		target: {node: 0, value: 'detune'}
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
			frequency: 1
		},
		target: 'mixer',
		retrigger: false
	}
})

minorScale = [
	{time: '0:0', length: '4n', note: 57, velocity: 0.8},
	{time: '0:1', length: '4n', note: 59, velocity: 0.8},
	{time: '0:2', length: '4n', note: 61, velocity: 0.8},
	{time: '0:3', length: '4n', note: 62, velocity: 0.8}
]

padSynth.part.add('0:0', minorScale)
