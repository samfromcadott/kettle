console.log('Works')

$('#volume-control').on('input', function () {
	audioTrack.volume.set( 'volume', Math.log( $(this).val() )*36 )
})

$('#pan-control').on('input', function () {
	audioTrack.pan.set( 'pan', $(this).val() )
})

$('#update-program').click( () => {
	var clip = {}
	clip.time = $('#time').val() + 'm'
	clip.buffer = getFileName(fileArray[ parseInt( $('#sample').val(), 10 ) ])
	clip.start = $('#start').val() + 'm'
	clip.length = $('#length').val() + 'm'
	audioTrack.part.add( clip )
})
