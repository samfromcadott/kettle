<template>
	<div class="song-editor container">
		<div class="song-editor header">
			<button id="play">Play</button>
			<button id="pause">Pause</button>
			<button id="stop">Stop</button>
			<input type="checkbox" id="metronome-checkbox">
			<label for="metronome-checkbox">Metronome</label>
		</div>
		<div class="song-editor body">
			<kettle-track name="Track 1" />

		</div>
	</div>
</template>

<script>
import KettleTrack from './track.vue'

export default {
	components: {
		KettleTrack
	}

}
</script>

<style scoped>
.body {
	overflow: scroll;
}


</style>
