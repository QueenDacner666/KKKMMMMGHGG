<style lang="sass">
@import './share.sass'
</style>

<template lang="pug">
  el-table(ref="table"
    :data="list"
    empty-text="選單是空的"
    sum-text="合計"
    :height="windowHeight"
    border
    show-summary)
    el-table-column(type="index" width="66" fixed="left")
    el-table-column(label="品名" prop="title" min-width="450")
    el-table-column(label="數量" prop="count" width="80")
    el-table-column(label="價格" prop="total" width="120")
</template>

<script lang="ts">
import _ from 'lodash'
import pako from 'pako'
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { IRootState } from '../store'
import { State } from 'vuex-class'

@Component
export default class Share extends Vue {
  @State((state: IRootState) => state.browser.screen.height)
  windowHeight: number

  get list () {
    if (!this.$route.query.list) return []

    let data = []
    try {
      const mapString = Buffer.from(this.$route.query.list[1], 'hex').toString();
      const mapUnzip = pako.inflate(mapString, { to: 'string' })
      const map = JSON.parse(mapUnzip)
      data = _.map(map, (item, key) => {
        item.id = key
        item.total = item.price * item.count
        return item
      })
    } catch (error) {
      data = []
    }

    return data
  }

  get isListEmpty () {
    return _.isEmpty(this.list)
  }
}
</script>
