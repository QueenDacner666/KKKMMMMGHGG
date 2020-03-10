<style lang="sass" module>
@import './side-nav.sass'
</style>

<template lang="pug">
  div(:class="[ $style.container, containerClasses ]" @keyup.esc="close" tabindex="0")
    div(:class="[ $style.content, contentClasses ]")
      slot
    backdrop(:class="$style.backdrop" @close="close" ref="backdrop")
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Emit } from 'vue-property-decorator'
import getScrollBarWidth from 'element-ui/lib/utils/scrollbar-width'
import { getStyle } from 'element-ui/lib/utils/dom'
import Backdrop from './backdrop.vue';

@Component({
  components: { Backdrop }
})
export default class SideNav extends Vue {
  public $style: any
  public $refs: {
    backdrop: Vue
  }

  @Prop()
  fixed: boolean
  @Prop()
  swipeable: boolean
  @Prop()
  show: boolean
  @Prop({ default: 'left' })
  side: string
  @Prop({ default: 15 })
  swipeThreshold: number
  @Prop({ default: 100 })
  swipeDistance: number
  @Prop()
  contentClass: string

  visible: boolean = false
  bodyOverflow: string = null
  bodyPaddingRight: string = null
  mountedRect: ClientRect
  initialTouchPosition: number
  canMove: boolean
  scrollBarWidth: number

  get containerClasses() {
    const _classes = []

    if (this.visible) _classes.push(this.$style['active'])
    if (this.fixed) _classes.push(this.$style['fixed'])
    if (this.side && this.side === 'left') _classes.push(this.$style['left'])
    if (this.side && this.side === 'right') _classes.push(this.$style['right'])
    if (this.show) _classes.push(this.$style['show'])

    return _classes
  }
  get contentClasses () {
    const _classes = []

    if (this.contentClass) _classes.push(this.contentClass)

    return _classes
  }

  mounted () {
    if (!this.swipeable) {
      return
    }

    this.mountedRect = this.$refs.backdrop.$el.getBoundingClientRect()
    this.initialTouchPosition = null
    this.canMove = false

    document.addEventListener('touchstart', this.handleTouchStart)
    document.addEventListener('touchend', this.handleTouchEnd)
    document.addEventListener('touchmove', this.handleTouchMove)
  }
  beforeDestroy () {
    if (!this.swipeable) {
      return
    }

    if (this.bodyOverflow !== null && this.bodyOverflow !== 'hidden') {
      document.body.style.overflow = this.bodyOverflow
      document.body.style.paddingRight = this.bodyPaddingRight
    }
    this.bodyOverflow = null
    this.bodyPaddingRight = null

    document.removeEventListener('touchstart', this.handleTouchStart)
    document.removeEventListener('touchend', this.handleTouchEnd)
    document.removeEventListener('touchmove', this.handleTouchMove)
  }

  @Emit()
  open () {
    this.visible = true
    this.$el.focus()

    // 防止滾動
    if (!this.bodyOverflow) {
      this.bodyPaddingRight = document.body.style.paddingRight
      this.bodyOverflow = document.body.style.overflow
    }
    this.scrollBarWidth = getScrollBarWidth()
    let bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight
    let bodyOverflowY = getStyle(document.body, 'overflowY')
    if (this.scrollBarWidth > 0 && (bodyHasOverflow || bodyOverflowY === 'scroll')) {
      document.body.style.paddingRight = this.scrollBarWidth + 'px'
    }
    document.body.style.overflow = 'hidden'
  }

  @Emit()
  close () {
    this.visible = false
    this.$el.blur()

    // 防止滾動
    this.$nextTick(() => {
      if (this.bodyOverflow !== 'hidden') {
        document.body.style.overflow = this.bodyOverflow
        document.body.style.paddingRight = this.bodyPaddingRight
      }
      this.bodyOverflow = null
      this.bodyPaddingRight = null
    })
  }

  toggle () {
    if (this.visible) {
      this.close()
    } else {
      this.open()
    }
  }

  isHorizontallyInside (positionX) {
    return positionX > 0 && positionX < this.mountedRect.left + this.mountedRect.width
  }

  isVerticallyInside (positionY) {
    return positionY > 0 && positionY < this.mountedRect.top + this.mountedRect.height
  }

  isFromStartWhenClosed (positionX) {
    if (this.visible) {
      return true
    }

    return positionX < this.swipeThreshold
  }

  handleTouchStart (event) {
    const positionX = event.touches[0].clientX - this.mountedRect.left
    const positionY = event.touches[0].clientY - this.mountedRect.top

    if (
      !this.isHorizontallyInside(positionX) ||
      !this.isVerticallyInside(positionY) ||
      !this.isFromStartWhenClosed(positionX)
    ) {
      return
    }

    this.initialTouchPosition = positionX
    this.canMove = true
  }

  handleTouchEnd () {
    this.canMove = false
    this.initialTouchPosition = null
  }

  handleTouchMove (event) {
    if (!this.canMove) {
      return
    }

    const positionX = event.touches[0].clientX

    const difference = this.visible
      ? this.initialTouchPosition - positionX
      : positionX - this.initialTouchPosition

    const action = this.visible
      ? 'close'
      : 'open'

    if (difference > this.swipeDistance) {
      this[action]()
    }
  }

}
</script>
