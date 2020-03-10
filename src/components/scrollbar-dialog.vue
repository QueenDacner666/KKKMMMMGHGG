<style lang="sass" module>
@import './scrollbar-dialog.sass'
</style>

<template lang="pug">
  el-dialog(:class="$style.container" :style="styles"
    :title="title"
    :visible="visible"
    :fullscreen="fullscreen"
    :width="width"
    @close="handleClose"
    @open="handleOpen")
    div(v-if="$slots.title" slot="title")
      slot(name="title")
    slot(v-if="$slots.default")
    div(v-if="$slots.footer" slot="footer")
      slot(name="footer")
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import PerfectScrollbar from 'perfect-scrollbar'

@Component
export default class ScrollbarDialog extends Vue {
  $ps: PerfectScrollbar = null

  @Prop({ default: true })
  switcher: boolean

  @Prop({ required: true })
  size: string

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  visible: boolean

  get width () {
    switch (this.size) {
      case 'lg':
      case 'md':
        return '60%'
      case 'sm':
        return '80%'
      case 'xs':
      default:
        return null
    }
  }

  get fullscreen () {
    return this.size === 'xs'
  }

  mounted() {
    if (this.switcher) {
      this.$psInitialize()
    }
  }

  beforeDestroy() {
    this.$psDestroy()
  }

  @Emit('open')
  handleOpen () {
    this.$psUpdate()
  }

  @Emit('close')
  handleClose () {
    this.$psUpdate()
  }

  @Watch('switcher')
  handleSwitchChange (val: boolean) {
    if (val === true && !this.$ps) {
      this.$psInitialize()
    } else if (val === false && this.$ps) {
      this.$psDestroy()
    }
  }

  get styles() {
    if (this.switcher) return null
    return {
      overflow: 'scroll'
    }
  }

  $psInitialize() {
    if (!this.$ps) {
      this.$ps = new PerfectScrollbar('HTMLElement')
    }
  }

  $psUpdate() {
    if (!this.$ps) return

    this.$ps.update()
  }

  $psDestroy() {
    if (!this.$ps) return

    this.$ps.destroy()
    this.$ps = null
  }
}
</script>

