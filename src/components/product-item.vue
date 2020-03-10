<style lang="sass" module>
@import './product-item.sass'
</style>

<template lang="pug">
  div(:class="[ $style['container'], hoveredContainer ? $style['hover'] : '', selected ? $style['selected'] : '' ]"
    @click="handleClickItem(id, data)"
    @mouseover="hoveredContainer = true"
    @mouseout="hoveredContainer = false")
    div(:class="$style['title-container']")
      h3 {{ data.name }}
    div(:class="$style['detail-container']")
      el-row(:class="$style['info-container']")
        el-col(:xs="24" :sm="4")
          div(:class="$style['state-container']")
            i(v-if="data.state.hot" :class="[ 'iconfont', 'toolman-icon-hot', $style['hot'] ]")
            i(v-else :class="[ 'iconfont', 'toolman-icon-circle', $style['dot'] ]")
            i(v-if="data.state.creditCard" :class="[ 'iconfont', 'toolman-icon-credit-card', $style['credit-card'] ]")
            i(v-else :class="[ 'iconfont', 'toolman-icon-circle', $style['dot'] ]")
            i(v-if="data.price.special" :class="[ 'iconfont', 'toolman-icon-data', $style['special'] ]")
            i(v-else :class="[ 'iconfont', 'toolman-icon-circle', $style['dot'] ]")
        el-col(:xs="24" :sm="{ span: 8, offset: 12 }")
          div(:class="$style['price-container']")
            span(v-if="data.price.special" :class="$style['source']") {{ data.price.source }}
            span(:class="$style['price']") {{ data.price.special || data.price.source }}
      div(:class="$style['action-btn-container']")
        el-tooltip(:value="showAddOneTip" content=" +1 " placement="top" manual)
          el-button(class="el-icon-plus" size="medium" @click.stop="handleClickAdd(sectionId, id, data)")
    span(v-show="selected" :class="$style['badge']") 已選取
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import { IProductItem } from '../stores/product'

@Component
export default class ProductItem extends Vue {
  @Prop({ required: true })
  id: string

  @Prop({ required: true })
  sectionId

  @Prop({ required: true })
  data: IProductItem

  @Prop({ default: false })
  selected: boolean

  hoveredContainer: boolean = false

  showAddOneTip: boolean = false

  @Emit('click-info')
  handleClickItem (hasImage: boolean, id: string, uuid: number) {}

  @Emit('click-add')
  handleClickAdd (sectionId: string, id: string, uuid: number) {

    this.showAddOneTip = true
    setTimeout(() => this.showAddOneTip = false, 400)
  }
}
</script>
