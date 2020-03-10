<style lang="sass">
@import './assets/element-ui-polify.sass'
@import './assets/ps.css'

html, body, #app
  height: 100%
body
  overflow: auto
  position: relative
</style>

<template lang="pug">
  div#app
    router-view
</template>

<script lang="ts">
import Vue from 'vue'
import { Action } from 'vuex-class'
import { Component } from 'vue-property-decorator'
import { isMobile } from 'is-mobile'

@Component
export default class App extends Vue {
  mounted () {
    window.scrollTo(0,1)

    this.initWindowResize(true)
    this.detectBrowserIsMobile()
  }

  beforeDestroy () {
    this.destroyWindowResize()
  }

  initWindowResize (first: boolean = false) {
    if (first) this.handleWindowResize(null)
    window.addEventListener('resize', this.handleWindowResize)
  }

  destroyWindowResize () {
    window.removeEventListener('resize', this.handleWindowResize)
  }

  detectBrowserIsMobile () {
    this.$store.commit('browser/mobile', {
      data: isMobile(),
    })
  }

  handleWindowResize (event) {
    this.$store.dispatch('browser/windowResize', {
      window, event
    })
  }
}
</script>
