<style lang="sass" module>
@import './cart-list.sass'
</style>

<template lang="pug">
  scrollbar-dialog(
    title="總估價單"
    :visible="visible"
    :size="screenSize"
    :switcher="!isMobile"
    @close="handleClose")
    div(:class="$style['container']")
      div(:class="$style['list-container']")
        cart-item(v-if="!isNilList" v-for="(cart, key) in list" :key="key"
          :id="key"
          :data="cart"
          @change-count="handleChangeCount"
          @click-delete="handleRowDelete"
          @click-info="handleProductInfoClick")
        template(v-else)
          el-row(type="flex" justify="center" v-once)
            span(:class="$style['empty-title']") 無資料
    div(slot="footer")
      //- a(ref="downloadLink" v-show="false" :href="file")
      el-input(:value="fullUrl" disabled)
        //- el-button(slot="prepend" @click="handleDownloadCSV" :style="{ color: '#1f2d3d' }") 下載
        el-tooltip(slot="append" effect="dark" :content="contentCopy" placement="top")
          el-button(:style="{ color: '#1f2d3d' }"
            v-clipboard:copy="fullUrl"
            v-clipboard:success="handleCopySuccess")
            i(:class="[ 'iconfont', 'toolman-icon-copy' ]")
</template>

<script lang="ts">
import _ from "lodash";
import Vue from "vue";
import json2csv from "json2csv";
import moment from "moment";
import { Component, Prop } from "vue-property-decorator";
import { State, Getter } from "vuex-class";
import { IRootState } from "../store";
import { ICartMap, ICart } from "../stores/cart";
import CartItem from "../components/cart-item.vue";
import DialogProductInfo from "../dialogs/product-info.vue";
import ScrollbarDialog from "../components/scrollbar-dialog.vue";

const VUEX_DIALOG_SHOPPING_CART = "SHOPPING_CART";

@Component({
  components: { CartItem, DialogProductInfo, ScrollbarDialog }
})
export default class CartList extends Vue {
  public $refs: {
    downloadLink: HTMLAnchorElement;
  };

  @State((state: IRootState) => state.cart.map)
  list: ICartMap;

  @State(
    (state: IRootState) =>
      _.get(state, `dialog.${VUEX_DIALOG_SHOPPING_CART}`, false) === true
  )
  visible: boolean;

  @State((state: IRootState) => state.browser.screen.size)
  screenSize: string;

  @State((state: IRootState) => state.browser.mobile)
  isMobile: boolean;

  @Getter("cart/url")
  url: string;

  // file: any = null

  contentCopy: string = "複製";

  get dialogWidthPercent() {
    if (this.isScreenSizeXS) {
      return null;
    }
    return "80%";
  }
  get isScreenSizeXS() {
    return this.screenSize === "xs";
  }
  get isNilList() {
    return !!!this.list;
  }
  get fullUrl() {
    return this.url ? `${window.location.origin}${this.url}` : null;
  }

  handleClose() {
    this.$store.commit("dialog/set", {
      name: VUEX_DIALOG_SHOPPING_CART,
      value: false
    });
  }
  handleChangeCount(count: number, id: string, data: ICart) {
    this.$store.commit("cart/count", { id, value: count });
  }
  handleRowDelete(id: string) {
    this.$store.commit("cart/drop", { id });
  }
  handleProductInfoClick(id: string, data: ICart) {
    this.$store.commit("dialog/open", "PRODUCT_INFO");
    this.$store.dispatch(
      "company/evaluate/category/product/info/GET_productInfo",
      { id, uuid: data.uuid }
    );
  }
  // handleDownloadCSV (id: string) {
  //   if (_.isEmpty(this.list)) {
  //     this.$message({
  //       message: '沒有資料！無法下載',
  //       type: 'warning'
  //     })
  //     return
  //   }

  //   const csv = json2csv({
  //     data: this.list,
  //     fields: [ 'title', 'count', 'total' ],
  //     fieldNames: [ '品名', '數量', '價格' ]
  //   })
  //   const fileData = new Blob([csv], { type: 'application/csv' })

  //   this.file = window.URL.createObjectURL(fileData)
  //   this.$refs.downloadLink.download = `估價單-${moment().format('YYYY-MM-DD')}__${_.ceil(Math.random() * 100000)}.csv`

  //   this.$nextTick(() => {
  //     this.$refs.downloadLink.click()
  //   })
  // }
  handleCopySuccess() {
    this.contentCopy = "複製成功";
    setTimeout(() => {
      this.contentCopy = "複製";
    }, 1500);
  }
}
</script>
