<style lang="sass" module>
@import './cart-item.sass'
</style>

<template lang="pug">
  div(:class="[ $style['container'], hoveredContainer ? $style['hover'] : '' ]"
    @mouseover="hoveredContainer = true"
    @mouseout="hoveredContainer = false")
    div(:class="$style['main-container']")
      div(:class="$style['title-container']")
        h3 {{ data.title }}
      el-row(:class="$style['detail-container']")
        el-col(:xs="16" :sm="8")
          el-input-number(:class="$style['count']" size="small" :value="data.count" :min="1" :max="99"
            @change="count => handleChangeCount(count, id)")
        el-col(:xs="8" :sm="6")
          span(:class="$style['price']") {{ data.price }}
        el-col(:xs="24" :sm="10")
          span(:class="$style['total']") {{ total }}
    div(:class="$style['action-btn-container']")
      el-button(class="el-icon-info" size="medium" @click.stop="handleClickInfo(id, data)")
      el-button(class="el-icon-delete" type="danger" size="medium" @click.stop="handleClickDelete(id)")
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import { ICart } from '../stores/cart'

@Component
export default class CartItem extends Vue {
  @Prop({ required: true })
  id: string

  @Prop({ required: true })
  data: ICart

  hoveredContainer: boolean = false

  get total() {
    return _.multiply(this.data.price, this.data.count)
  }

  @Emit('change-count')
  handleChangeCount (count: number, id: string) {}

  @Emit('click-info')
  handleClickInfo (id: string, data: ICart) {}

  @Emit('click-delete')
  handleClickDelete (id: string) {}
}
</script>
