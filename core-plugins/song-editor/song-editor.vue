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
			<div class="song-editor track">
				<div class="song-editor track-control">
					<h4 class="song-editor track-title">Track 1</h4>
					<p>
						<input id="volume-control" type="range"  min="0" max="1.2" value="1" step="0.002"/>
						<label for="volume-control">Volume</label>
					</p>
					<p>
						<input id="pan-control" type="range" min="-1" max="1" value="0" step="0.001"/>
						<label for="pan-control">Pan</label>
					</p>
				</div>
				<div class="song-editor track-timeline">
					<div class="song-editor clip">
						Example Clip
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

</script>

<style scoped>
.body {
	overflow: scroll;
}

.track {
	display: inline-flex;
}

.track-control {
	position: relative;
	left: 0;
	background-color: rgb(255, 255, 255);
}

.track-timeline {
	width: 500em;
	float: right;
}

.clip {
	height: 100%;
	width: 10em;
	background: white;
}
</style>
