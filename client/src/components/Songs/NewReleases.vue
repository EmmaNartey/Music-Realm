<template>
  <div class="ui stackable five cards">
    <div class='ui card' v-for="song in songs" :key="song.title">
      <a class='image' href='mixtape/daz-dillinger-dazamataz'>
        <img img :src="song.image" alt='Various Artists - "song.title"'>
      </a>
      <div class='content'>
        <a class='description'><b>{{song.title}}</b></a>
        <div class='meta'>{{song.artist}}</div>
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
        }
      ]
    }
  }
}
</script>

<style>

</style>
