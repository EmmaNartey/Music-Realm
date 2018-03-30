import Vue from 'vue'
import Router from 'vue-router'
import Songs from '@/components/Songs/Index'
import Contact from '@/components/Contact'
import TopSongs from '@/components/TopSongs/Index'
import NewReleases from '@/components/NewReleases/Index'
import ViewSong from '@/components/ViewSong/Index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'songs',
      component: Songs
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      path: '/top-songs',
      name: 'top-songs',
      component: TopSongs
    },
    {
      path: '/new-releases',
      name: 'new-releases',
      component: NewReleases
    },
    {
      path: '/songs/:songId',
      name: 'song',
      component: ViewSong
    }
  ]
})
