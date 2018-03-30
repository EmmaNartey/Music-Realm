import Api from '@/services/Api'

export default {
  index (songs) {
    return Api().get('songs')
  },
  show (song) {
    return Api().get(`songs/${song.id}`)
  },
  show (songs) {
    return Api().get(`songs/search`)
  }
}
