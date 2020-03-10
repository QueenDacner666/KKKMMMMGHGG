<style lang="sass" module>
@import './backdrop.sass'
</style>

<template lang="pug">
  div(:class="$style.backdrop" @click="close" @keyup.esc="close")
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit } from 'vue-property-decorator'

@Component
export default class Backdrop extends Vue {
  @Emit()
  close () {}
}
</script>
