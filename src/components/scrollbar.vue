<style lang="sass" module>
@import './scrollbar.sass'
</style>

<template lang="pug">
  section(:class="$style.container"
    :style="styles"
    @ps-scroll-y="handleScroll"
    @ps-scroll-x="handleScroll"
    @ps-scroll-up="handleScroll"
    @ps-scroll-down="handleScroll"
    @ps-scroll-left="handleScroll"
    @ps-scroll-right="handleScroll"
    @ps-y-reach-start="handleScroll"
    @ps-y-reach-end="handleScroll"
    @ps-x-reach-start="handleScroll"
    @ps-x-reach-end="handleScroll")
    slot
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import PerfectScrollbar from 'perfect-scrollbar'

@Component
export default class Scrollbar extends Vue {
  @Prop({ default: null })
  options: PerfectScrollbar.Options

  @Prop({ default: true })
  switcher: boolean

  inited: boolean = false

  $ps: PerfectScrollbar = null

  mounted() {
    if (this.switcher) {
      this.initialize()
    }
  }

  beforeDestroy() {
    this.destroy()
  }

  get styles() {
    if (this.switcher) return null
    return {
      overflow: 'scroll'
    }
  }

  initialize() {
    if (!this.$ps) {
      this.$ps = new PerfectScrollbar('HTMLElement', {
        wheelPropagation: true,
        ...this.options,
      })

      this.inited = true
    }
  }

  update() {
    if (!this.$ps) return

    this.$ps.update()
  }

  destroy() {
    if (!this.$ps) return

    this.$ps.destroy()
    this.$ps = null
    this.inited = false
  }

  handleScroll(event) {
    if (_.isEqual(event.type, 'ps-y-reach-end') && _.has(this.$listeners, 'infinite')) {
      this.$emit('infinite', event)
    }
    if (_.has(this.$listeners, event.type)) {
      this.$emit(event.type, event)
    }
  }

  @Watch('switcher')
  handleSwitchChange (val: boolean) {
    if (val === true && (!this.inited || !this.$ps)) {
      this.initialize()
    } else if (val === false && (this.inited || this.$ps)) {
      this.destroy()
    }
  }
}
</script>
