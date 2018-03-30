<template>
  <div class="ui stackable five cards">
	<div class='ui card' v-for="song in songs">
	  <a>
		<router-link :to="{path:'/songs/:songId'}">
		    <div class='ui image'>
		      <img :src="song.thumbnail" alt="song.artiste - song.title">
		    </div>
		</router-link>
	  </a>
	  <div class='content'>
	    <div class='description'>
	      <b>{{ song.title }}</b>
	    </div>
	    <div class='meta'>{{ song.artiste }}</div>
	  </div>
	</div>
	<div class="ui container">
	<br>
	<div class='ui grid'>
	  <div class='two column row'>
	    <div class='left floated column'>
	      <a href='mixtapes?p=0'>
		    <button class='ui labeled icon button'>
		      <i class='left chevron icon'></i>Newer
		    </button>
		  </a>
	    </div>
	    <div class='right'>	      
		  <a href='mixtapes?p=1'>
		    <button class='ui right labeled icon button'>
		      Older<i class='right chevron icon'></i>
		    </button>
		  </a>
	    </div>
	  </div>
	</div>
	</div>
  </div>
</template>

<script>
import SongsService from '@/services/SongsService'

export default {
  data () {
    return {
      songs: null
    }
  },
  async mounted () {
    this.songs = (await SongsService.index()).data
  }
}
</script>

<style scoped>

</style>
