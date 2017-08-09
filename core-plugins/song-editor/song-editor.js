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

$('.song-editor.body').scroll(function(){
	$('.song-editor.track-control').css({
		'left': $(this).scrollLeft()
	})
})

$('.song-editor.body').sortable({
	handle: ".song-editor.track-title"
})

$( ".song-editor.clip" ).draggable({
	containment: "parent"
})

app.directive('songEditorTrack', function() {
	return {
		restrict: 'C',
		template : function (elem, attr) {
			return '<div class="song-editor track-control"><h4 class="song-editor track-title">{{currentProject.tracks['+attr.track+'].name}}</h4><p><input id="volume-control" type="range"  min="0" max="1.2" value="1" step="0.002"/><label for="volume-control">Volume</label></p><p><input id="pan-control" type="range" min="-1" max="1" value="0" step="0.001"/><label for="pan-control">Pan</label></p></div><div class="song-editor track-timeline">This is where the clips will go</div>'
		}
	}
})
