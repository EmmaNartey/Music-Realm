<template>
  <div id="app">
    <div class="ui container">
      <br>
      <page-header />
      <router-view/>
      <br>
      <div class="ui divider"></div>
      <page-footer />
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/Header.vue'
import PageFooter from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    PageHeader,
    PageFooter
  }
}
</script>

<style>

</style>
