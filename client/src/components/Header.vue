<template>
  <div id='main-menu' class='ui stackable inverted menu'>
    <a class='active red item'><router-link :to="{path:'/'}">Music Realm</router-link></a>
    <a class='item'><router-link :to="{path:'/top-songs'}">Top Songs</router-link></a>
    <a class='item'><router-link :to="{path:'/new-releases'}">New Releases</router-link></a>
    <div class='right menu'>
      <div class='ui category search item'>
        <div class='ui inverted icon input'>
          <input id='search-term' class='prompt' type='text' placeholder='Search songs, artistes'>
          <i class='search link icon' id='search-button'></i>
        </div>
        <div class='results'></div>
      </div>
      <a class='item'>
        <router-link :to="{path:'/contact'}"><i class='mail icon'></i>Contact</router-link>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style scoped>

</style>
