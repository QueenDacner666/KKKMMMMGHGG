<style lang="sass" module>
@import './tag-input.sass'
</style>

<template lang="pug">
  el-input(placeholder="請輸入搜尋條件" v-model="input" :class="$style['search-bar-container']"
    type="text"
    @keydown.native.delete.stop="removeLastTag()"
    @keydown.native.enter.188.tab.prevent.stop="addTag()")
    template(v-if="!isInnerTagsEmpty" slot="prepend")
      scrollbar(ref="list"
        :switcher="switcher"
        :options="{ wheelPropagation: false }")
        el-tag(v-if="!isInnerTagsEmpty" v-for="(tag, index) in innerTags"
          :key="index"
          @close="removeTag(index)"
          disable-transitions
          closable) {{ tag }}
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { Component, Watch, Model, Prop } from 'vue-property-decorator'
import Scrollbar from './scrollbar.vue'

@Component({
  components: { Scrollbar }
})
export default class TagInput extends Vue {
  public $refs: {
    list: Scrollbar
  }

  input: string = null

  @Prop({ required: true, default: [] })
  tags: string[]

  @Prop({ default: true })
  switcher: boolean

  innerTags: string[] = []

  get isInnerTagsEmpty() {
    return _.isEmpty(this.innerTags)
  }

  @Watch('tags')
  handleTagsChange () {
    if (_.isEqual(this.innerTags, this.tags)) return

    this.innerTags = [...this.tags]
  }

  @Watch('innerTags')
  handleInnerTags () {
    if (!this.$refs.list) return
    console.log('innertags change');

    this.$refs.list.update()
  }

  addTag () {
    if (!this.input || this.innerTags.indexOf(this.input) >= 0) return

    this.innerTags.push(this.input)
    this.input = null
    this.updateTags()
    this.focusLastTag()
  }

  removeTag (index) {
    this.innerTags.splice(index, 1)
    this.updateTags()
  }

  removeLastTag () {
    if (this.input) return

    this.innerTags.pop()
    this.updateTags()
    this.focusLastTag()
  }

  focusLastTag () {
    setTimeout(() => {
      if (
        this.innerTags.length <= 0
        ||
        !this.$refs.list
      ) return
      const $list = this.$refs.list.$el

      $list.scrollTo({
        left: $list.scrollWidth - $list.clientWidth,
      })

      this.$refs.list.update()
    }, 50)
  }

  updateTags () {
    this.$emit('update:tags', this.innerTags)
  }
}
</script>
