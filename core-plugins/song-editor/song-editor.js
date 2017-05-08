$('#play').click( () => {
	audio.play()
})

$('#stop').click( () => {
	audio.stop()
})

$('#pause').click( () => {
	audio.pause()
})
$( "#metronome-checkbox" ).change(function () {
	if (this.checked) {
		audio.metronome.changeMode('on')
	}
	else {
		audio.metronome.changeMode('off')
	}
})

$('#volume-control').on('input', function () {
	audioTrack.volume.set( 'volume', Math.log( $(this).val() )*36 )
})

$('#pan-control').on('input', function () {
	audioTrack.pan.set( 'pan', $(this).val() )
})

$('#update-program').click( function () {
	var clip = {}
	clip.time = $('#time').val() + 'm'
	clip.buffer = getFileName(fileArray[ parseInt( $('#sample').val(), 10 ) ])
	clip.start = $('#start').val() + 'm'
	clip.length = $('#length').val() + 'm'
	audioTrack.part.add( clip )
})

// $('#new-track').click( function () {
//
// })
