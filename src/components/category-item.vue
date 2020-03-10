<style lang="sass" module>
@import './category-item.sass'
</style>

<template lang="pug">
  router-link(
    :to="to"
    :class="[ $style['container'], hovered ? $style['hover'] : '' ]"
    :active-class="$style['active']"
    exact-active-class=""
    @mouseover.native="hovered = true"
    @mouseout.native="hovered = false"
    replace
  )
    slot
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class CategoryItem extends Vue {
  @Prop({ required: true })
  to: string

  hovered: boolean = false
}
</script>
