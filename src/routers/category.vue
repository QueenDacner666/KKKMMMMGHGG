<style lang="sass" module>
@import './category.sass'
</style>

<template lang="pug">
  div(v-if="!isCategoryEmpty" :class="$style['container']")
    div(:class="$style['header-container']")
      div(:class="$style['title-container']")
        div(:class="$style['menu']" @click="toggleSidenavAtMobile")
          el-badge(:is-dot="!isEmptyCart")
            i(:class="[ 'iconfont', 'toolman-icon-menu' ]")
        div(:class="$style['title']")
          h2 {{ category.name }}
        div(:class="$style['info']")
          el-popover(placement="bottom-end" title="搜尋技巧" width="300" trigger="click")
            ul(:class="$style['list-info-detail']")
              li 自行輸入條件 例：
                ul(:class="$style['list-info-detail']")
                  li
                    code 散熱
                    | 顯示標題有 散熱 的商品
              li 價格區間 例：
                ul(:class="$style['list-info-detail']")
                  li
                    code $100~200
                    | 100元到200元區間
                  li
                    code $100~
                    | 100元以上
                  li
                    code $~100
                    | 100元以下
            el-button(slot="reference" :class="[$style['btn-info'], 'el-icon-info']")
      div(v-scrollbar="{ enable: !isMobile }" :class="$style['status-container']")
        span {{ summaryText }}
      div(:class="$style['search-bar-container']")
        tag-input(:tags.sync="search" :switcher="!isMobile")
    div(v-scrollbar="{ enable: !isMobile }" ref="list" :class="$style['list-container']")
      template(v-if="!isProductsEmpty" v-for="(section, sid) in products")
        product-group-item(:key="sid" :title="section.name")
        template(v-for="(product, pid) in section.map")
          product-item(:key="pid"
            :id="pid"
            :section-id="sid"
            :data="product"
            @click-info="handleProductItemClick"
            @click-add="handleProductClickAdd")
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Getter, Mutation, State } from 'vuex-class'
import InfiniteLoading from 'vue-infinite-loading'
import SearchBar from '../components/search-bar.vue'
import ProductItem from '../components/product-item.vue'
import ProductGroupItem from '../components/product-group-item.vue'
import TagInput from '../components/tag-input.vue'
import { IRootState } from '../store'
import { ICart } from '../stores/cart'
import { IProductItem } from '../stores/product'

@Component({
  components: { SearchBar, ProductItem, ProductGroupItem, TagInput, InfiniteLoading },
})
export default class Category extends Vue {
  public $message: any
  public $refs: {
    list: any
  }

  @Getter('company/evaluate/category/product/current')
  products

  @Getter('company/evaluate/category/current')
  category

  @Getter('cart/isEmpty')
  isEmptyCart: boolean

  @State((state: IRootState) => state.browser.mobile)
  isMobile: boolean

  @Watch('category', { immediate: true })
  handleRouteCategoryChange (val, oldVal) {
    if (!val) return

    this.$psScrollTop(0)
    this.search = []
    this.toggleSidenavAtMobile()
  }

  @Watch('search')
  handleSearchChange () {
    this.$psScrollTop(0)
    this.$store.commit('company/evaluate/category/product/page', {
      data: 1
    })
  }

  @Watch('products')
  handleProductsChange (val) {
    if (!_.isEmpty(val) && this.$refs.list && this.$refs.list.inited) {
      this.$refs.list.update()
    }
  }

  get summaryText () {
    const labelMap = {
      all: '全部：',
      hot: '熱門：',
      discuss: '討論：',
      image: '圖片：',
      change: '異動：',
      limited: '限時：',
    }

    return _.chain(this)
      .get('category.summary')
      .map((value, key) => {
        if (!value || !_.has(labelMap, key)) return undefined
        return `${labelMap[key]}${value}`
      })
      .compact()
      .join(' / ')
      .value()
  }

  get isCategoryEmpty () {
    return _.isEmpty(this.category)
  }
  get isCategorySummaryEmpty () {
    return _.isEmpty(this.category.summary)
  }
  get isProductsEmpty () {
    return _.isEmpty(this.products)
  }

  get search () {
    return this.$store.state.company.evaluate.category.product.search
  }

  set search (val) {
    this.$store.commit('company/evaluate/category/product/search', {
      data: val
    })
  }

  handleProductItemClick (id: string, data: IProductItem) {
    if (!data.state.image) {
      this.$message({
        message: '無圖片簡介',
        showClose: true,
        type: 'warning'
      })

      return
    }

    this.$store.commit('dialog/open', 'PRODUCT_INFO')
    this.$store.dispatch('company/evaluate/category/product/info/GET_productInfo', { id, uuid: data.uuid })
  }
  handleProductClickAdd (sectionId: string, id: string, data: IProductItem) {
    let item: ICart = _.get(this.$store.state, `cart.map.${id}`, null)

    if (!item) {
      item = {
        count: 1,
        price: data.price.special || data.price.source,
        title: data.name,
        uuid: data.uuid,
        sectionId,
        created: new Date(),
        updated: new Date(),
      }
    } else {
      item.count += 1
    }

    this.$store.commit('cart/map', {
      data: {
        [id]: item,
      },
    })
  }

  toggleSidenavAtMobile () {
    _.invoke(this, '$parent.toggleSidenavAtMobile')
  }

  $psScrollTop (val: number) {
    if (this.$refs.list && !this.isMobile) {
      this.$refs.list.scrollTop = val
    } else {
      window.scrollTo(0, val)
    }
    // _.set(this.$refs.list, '$el.scrollTop', val)
  }
}
</script>

