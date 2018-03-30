<template>
  <div class="ui stackable five cards">
	<div class='ui card' v-for="song in songs" :key="song.title">
	  <a href='/mixtape/no-city-like-mine-3'>
	    <div class='ui image'>
	      <img :src="song.image" alt='Various Artists - "song.title"'>
	    </div>
	  </a>
	  <div class='content'>
	    <div class='description'><b>{{song.title}}</b></div>
	    <div class='meta'>{{song.artist}}</div>
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
export default {
  data () {
    return {
      songs: [
        {
	      title: 'Bawasaaba',
	      artist: 'Stonbwoy',
	      image: 'https://i0.wp.com/www.dcleakers.com/wp-content/uploads/2018/01/loyalty.jpg?resize=400%2C434'
        },
        {
	      title: 'Ayoo',
	      artist: 'Shata Wale',
	      image: 'http://www.ghanamotion.com/wp-content/uploads/2017/03/shatta-wale-ayoo-500x500.jpg'
        },
        {
	      title: 'Heart Attack',
	      artist: 'Trey Songz',
	      image: 'https://t2.genius.com/unsafe/220x0/https%3A%2F%2Fimages.genius.com%2F051f4c8b76b381a430e0618df1e67796.1000x1000x1.jpg'
        },
        {
	      title: 'Royalty',
	      artist: 'Chris Brown',
	      image: 'https://is4-ssl.mzstatic.com/image/thumb/Music71/v4/0b/4b/6f/0b4b6fc8-8231-dbfd-49d3-a92bb95d0f24/mzm.nsulprvx.jpg/268x0w.jpg'
        },
        {
	      title: 'Bo no nie',
	      artist: 'Joe Mettle ft. Luigin Mclean',
	      image: 'https://worshippersgh.com/wp-content/uploads/2017/09/bonooni-1.jpg'
        },
        {
	      title: 'Wild Thoghts',
	      artist: 'DJ Khaled ft. Rihanna & Bryson Tiller ',
	      image: 'http://thatgrapejuice.net/wp-content/uploads/2017/06/dj-khaled-grateful-album-cover-thatgrapejuice.jpg'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
