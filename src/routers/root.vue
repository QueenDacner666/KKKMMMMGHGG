<style lang="sass" module>
@import './root.sass'
</style>

<template lang="pug">
  div(:class="$style.container")
    el-select(v-model="selectedCompany" placeholder="請選擇資料來源" size="large")
      el-option(v-for="company in companies"
        :key="company.key"
        :label="company.label"
        :value="company.key")
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { State } from 'vuex-class'
import { Component, Watch } from 'vue-property-decorator'

@Component
export default class Root extends Vue {
  @State(state => state.company.list)
  companies

  selectedCompany: string = null

  @Watch('selectedCompany')
  handleSelectedCompanyChange (val, oldVal) {
    if (
      _.isEmpty(val)
      ||
      _.isEqual(val, oldVal)
      ||
      _.isEqual(val, this.$route.params.company)
    ) return
    this.$router.push(`/${val}`)
  }
}
</script>
