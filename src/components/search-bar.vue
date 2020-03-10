<style lang="sass" module>
@import './search-bar.sass'
</style>
<style lang="sass">
.el-popover__title
  font-size: 15px
  font-weight: bold
  padding-bottom: 10px
</style>

<template lang="pug">
  div(:class="$style.container")
    el-select(:class="$style.container"
      v-model="selected"
      @change="handleChange"
      placeholder="輸入搜尋內容"
      no-data-text="無資料"
      multiple
      filterable
      allow-create
      remote)
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Model, Emit } from 'vue-property-decorator'

@Component
export default class SearchBar extends Vue {
  @Prop({ required: true })
  rules: any[]

  @Model('change')
  selected: any[]

  @Emit('change')
  handleChange () {}

}
</script>
