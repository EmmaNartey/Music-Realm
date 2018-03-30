<template>
  <div class="ui comments">
    <h3 class="ui dividing header">Comments</h3>
    <div class="comment" v-for="comment in comments" :key="comment.author">
      <a class="avatar">
        <img img :src="comment.image">
      </a>
      <div class="content">
        <a class="author">{{comment.author}}</a>
        <div class="metadata">
          <span class="date">{{comment.date}}</span>
        </div>
        <div class="text">
          {{comment.text}}
        </div>
        <div class="actions">
          <a class="reply">Reply</a>
        </div>
      </div>
    </div>
    <form class="ui reply form">
      <div class="field">
        <textarea></textarea>
      </div>
      <div class="ui inverted red labeled submit icon button">
        <i class="icon edit"></i> Add Reply
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      comments: [
        {
          author: 'Emma',
          date: 'Today at 5:42PM',
          text: 'Im really in love with the design.',
          image: 'https://i0.wp.com/www.dcleakers.com/wp-content/uploads/2018/01/loyalty.jpg?resize=400%2C434'
        },
        {
          author: 'Nike',
          date: 'Yesterday at 12:30AM',
          text: 'Waiting anxiously for Music Realm.',
          image: 'https://i.pinimg.com/474x/4b/5d/19/4b5d1954fbb5b6bad18f0ac25c4ab3c3--free-avatars-create-your-own-avatar.jpg'
        },
        {
          author: 'Kily',
          date: 'Just now',
          text: 'Mobile Realm always delivers the best. Looking forward to your new Project.',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbLD0l6-QiBjN9OmoS4uW6EUbacfvtR0WvB6UzATlognAD8ezz'
        },
        {
          author: 'Tom Tom',
          date: '5 days ago',
          text: 'Nice and dope designs.',
          image: 'https://i.pinimg.com/originals/d7/da/10/d7da1027e068515895562f7566862d61.png'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
