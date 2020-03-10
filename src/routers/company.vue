<style lang="sass" module>
@import './company.sass'
</style>

<template lang="pug">
  div(:class="$style['container']"
    :style="{ height: isMobile ? 'auto' : '100%' }"
    v-loading.fullscreen="isCategoriesEmpty"
    element-loading-text="正在取得產品列表...")
    side-nav(ref="sidenav" :content-class="$style['nav-container']" side="left" show fixed)
      div(:class="$style['header-container']")
        div(:class="$style['title']")
          h1
            a(:href="indexURL") 工具人
          h2
            router-link(to="/") 估價單
      div(v-scrollbar="{ enable: !isMobile }" :class="$style['list-container']")
        category-item(v-for="(category, key) in categories" :key="key"
          :to="`/${$route.params.company}/category/${key}`") {{ category.name }}
      div(:class="$style['footer']")
        el-select(v-model="$route.params.company" placeholder="請選擇資料來源" :class="$style['data-source-selector']" size="large")
          el-option(v-for="company in companies"
            :key="company.key"
            :label="company.label"
            :value="company.key")
        el-tooltip(content="總估價單" placement="top")
          el-badge(:value="cartTotalCount")
            el-button(:class="$style['btn-count']" @click="handleButtonCartListClick")
              i(:class="[ 'iconfont', 'toolman-icon-cart' ]")
    router-view(v-if="$route.params.category")
    div(v-else :class="$style['right-container']")
      div(:class="$style['right-header-container']")
        div(:class="$style['menu']" @click="toggleSidenav")
          i(:class="[ 'iconfont', 'toolman-icon-menu' ]")
      div(:class="$style['right-content']")
        span 請選擇商品類別
    dialog-cart-list
    dialog-product-info
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'
import SideNav from '../components/side-nav.vue'
import DialogCartList from '../dialogs/cart-list.vue'
import DialogProductInfo from '../dialogs/product-info.vue'
import CategoryItem from '../components/category-item.vue'
import { IRootState } from '../store'

@Component({
  components: { SideNav, DialogProductInfo, DialogCartList, CategoryItem }
})
export default class Company extends Vue {
  public $refs: {
    sidenav: SideNav,
  }

  indexURL: string = process.env.INDEX_URL

  @State(state => state.company.list)
  companies

  @State((state: IRootState) => state.company.evaluate.category.map)
  categories

  @State((state: IRootState) => state.browser.mobile)
  isMobile: boolean

  @Getter('cart/totalCount')
  cartTotalCount: number

  @Watch('$route.params.company')
  handleCompanyChange(val, oldVal) {
    if (val === oldVal) return

    this.$store.dispatch('company/evaluate/GET_evaluate', {
      company: val,
    })
  }

  get isCategoriesEmpty () {
    return _.isEmpty(this.categories) || _.keys(this.categories).length <= 0
  }

  mounted() {
    if (this.$route.params.company) {
      this.$store.dispatch('company/evaluate/GET_evaluate', {
        company: this.$route.params.company,
      })
    }
  }

  handleButtonCartListClick() {
    this.$store.commit('dialog/open', 'SHOPPING_CART')
  }

  toggleSidenav() {
    this.$refs.sidenav.toggle()
  }

  toggleSidenavAtMobile (timeout: boolean = false) {
    if (window.innerWidth < 768) {
      if (timeout) {
        setTimeout(() => {
          this.toggleSidenav()
        }, 500)
      } else {
        this.toggleSidenav()
      }
    }
  }
}
</script>
