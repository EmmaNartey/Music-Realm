<template>
  <div class="ui container">
    <first-view />
    <br><br>
    <div class="ui stackable grid">
      <div class="twelve wide column">
        <div class="ui grid">
		  <div class="two column row">
		    <div class="left floated column">
	          <h3 class="ui header mheading-1">
	            <div class="content">Top Songs</div>
	          </h3>
	        </div>
	        <div class="right">
	          <router-link :to="{path:'/top-songs'}">
	            <button class="ui labeled icon button more">
	              <i class="eye icon"></i>More
	            </button>
	          </router-link>
	        </div>
		  </div>
		</div>
		<top-songs />
		<br><br>
		<div class="ui grid">
          <div class="two column row">
            <div class="left floated column">
              <h3 class="ui header mheading-1">
              <div class="content">New Releases</div>
            </h3>
            </div>
            <div class="right">
              <router-link :to="{path:'/new-releases'}">
                <button class="ui labeled icon button more">
                  <i class="eye icon"></i>More
                </button>
              </router-link>
            </div>
          </div>
        </div>
        <new-releases />
      </div>
      <div class="four wide column">
        <div class="ui cards">
          <div class="orange card">
            <div class="content">
              <div class='ui icon header'>
                <i class='mobile alternate icon'></i>Get the app now!
              </div>
              <div class="ui centered grid app-features">
                unlimited downloads • streams • top songs • latest music • more
              </div>
            </div>
            <div class="extra content">
              <div class="ui">
                <a href="https://play.google.com/store/apps/details?id=com.JankStudio.Mixtapes" target="_blank">
                  <button class="ui button">
                    <i class="android icon"></i>Android
                  </button>
                </a>
                <a href="https://itunes.apple.com/us/app/damixhub-mixtapes-hip-hop/id1125533225?mt=8" target="_blank">
                  <button class="ui button">
                    <i class="apple icon"></i>iOS
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <br>
        <div class="ui vertical rectangle test ad" data-text="Vertical Rectangle"></div>
      </div>
    </div>
  </div>
</template>

<script>
import FirstView from './FirstView'
import TopSongs from './TopSongs'
import NewReleases from './NewReleases'

export default {
  components: {
    FirstView,
    TopSongs,
    NewReleases
  }
}
</script>

<style>

</style>
