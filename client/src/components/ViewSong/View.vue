<template>
  <div class="ui two column grid">
    <div class="ui card">
      <div class="ui image">
        <img :src="song.image">
      </div>
      <div class="extra content">
      <span class="right floated like">
        <i class="like icon"></i>
        Like
      </span>
      <span class="left floated">
        <button>
          <i class="cloud download alternate icon"></i>
          Download
        </button>
      </span>
    </div>
    </div>
    <div class="ui right floated">
      <div class="ui card">
        <div class="content">
          <div class="description">
            <h3 class="ui small header">
              {{song.description}}
            </h3>
          </div>
        </div>
      </div>
      <div class="ui divider"></div>
      <div class="ui statistics">
        <div class="statistic">
          <div class="value">2.3k</div>
          <div class="label">Downloads</div>
        </div>
        <div class="statistic">
          <div class="value">52</div>
          <div class="label">Likes</div>
        </div>
      </div>
      <div class="ui divider"></div>
    </div>
    </div>
  </div>
</template>

export default {
  data () {
    return {
      song: [
        {
        image: 'https://i0.wp.com/www.dcleakers.com/wp-content/uploads/2018/01/loyalty.jpg?resize=400%2C434',
        description: Stonebwoy of Bhim Nation drops another club banger which will get music lovers on their feet. Listen and enjoy the song.
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
