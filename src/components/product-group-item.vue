<style lang="sass" module>
@import './product-group-item.sass'
</style>

<template lang="pug">
  el-row(:class="$style['container']")
    span(:class="$style['title']") {{title}}
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class ProductGroupItem extends Vue {
  @Prop({ required: true })
  title: string
}
</script>
