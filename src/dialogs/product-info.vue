<style lang="sass" module>
@import './product-info.sass'
</style>

<template lang="pug">
  scrollbar-dialog(
    title="商品資訊"
    :visible="visible"
    :size="screenSize"
    :switcher="!isMobile"
    @close="handleClose")
    div(:class="$style['container']" v-loading="isVisibleButInfoNull")
      el-row(v-if="!isInfoNull" :gutter="10")
        el-col(:sm="24" :md="8")
          img(:src="info.image")
        el-col(:sm="24" :md="16")
          el-table(:data="info.detail"
            :show-header="false"
            :highlight-current-row="true"
            :border="true"
            empty-text="尚無資料")
            el-table-column(prop="value")
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { IProductInfo } from '../stores/product-info'
import { IRootState } from '../store'
import ScrollbarDialog from '../components/scrollbar-dialog.vue'

const VUEX_DIALOG_PRODUCT_INFO = 'PRODUCT_INFO'

@Component({
  components: { ScrollbarDialog },
})
export default class ProductInfo extends Vue {
  @State((state: IRootState) => state.company.evaluate.category.product.info.current)
  info: IProductInfo

  @State(state => _.get(state, `dialog.${VUEX_DIALOG_PRODUCT_INFO}`, false) === true)
  visible: boolean

  @State((state: IRootState) => state.browser.screen.size)
  screenSize: string

  @State((state: IRootState) => state.browser.mobile)
  isMobile: boolean

  get isInfoNull () {
    return _.isNil(this.info)
  }
  get isVisibleButInfoNull () {
    return this.visible && this.isInfoNull
  }

  handleClose () {
    this.$store.commit('dialog/set', { name: VUEX_DIALOG_PRODUCT_INFO, value: false })
    this.$nextTick(() => {
      this.$store.commit('company/evaluate/category/product/info/current', {
        data: null
      })
    })
  }

}

</script>
