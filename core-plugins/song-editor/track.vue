<template lang="html">
	<div class="song-editor track">
		<div class="song-editor track-control">
			<h4 class="song-editor track-title">{{name}}</h4>
			<p>
				<input id="volume-control" type="range"  min="0" max="1.2" :value="volume" step="0.002"/>
				<label for="volume-control">Volume</label>
			</p>
			<p>
				<input id="pan-control" type="range" min="-1" max="1" :value="pan" step="0.001"/>
				<label for="pan-control">Pan</label>
			</p>
		</div>
		<div class="song-editor track-timeline">
			<div class="song-editor clip">
				Example Clip
			</div>
		</div>
	</div>
</template>

<script>

export default {
	props: {
		name: {type: String, default: 'New Track'},
		volume: {type: Number, default: 1},
		pan: {type: Number, default: 0}

	}

}

</script>

<style lang="css">
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
