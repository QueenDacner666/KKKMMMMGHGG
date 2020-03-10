import { isBoolean } from 'lodash'
import { DirectiveOptions } from 'vue'
import PerfectScrollbar from 'perfect-scrollbar'

export default {
  name: 'scrollbar',
  inserted (el, binding, vnode) {
    const $el = ((isBoolean(binding.modifiers['body']) && binding.modifiers['body'] === true) && document.body) || el

    if (isBoolean(binding.value.enable) && binding.value.enable === false) {
      $el.style.overflow = 'scroll'
      return
    }

    $el.style.position = 'relative'
    $el.style.overflow = 'scroll'
    $el['$ps'] = new PerfectScrollbar(
      $el,
      binding.value.options && binding.value.options
    )
  },
  unbind (el, binding) {
    const $el = ((isBoolean(binding.modifiers['body']) && binding.modifiers['body'] === true) && document.body) || el

    if (isBoolean(binding.value.enable) && binding.value.enable === false) {
      $el.style.overflow = undefined
      return
    }

    $el.style.position = 'static'
    $el['$ps'] && $el['$ps'].destroy()
  },
  componentUpdated (el, binding) {
    const $el = ((isBoolean(binding.modifiers['body']) && binding.modifiers['body'] === true) && document.body) || el

    if (
      isBoolean(binding.value.enable) && isBoolean(binding.oldValue.enable)
      &&
      binding.value.enable === false
      &&
      binding.oldValue.enable === true
    ) {
      $el['$ps'] && $el['$ps'].destroy()
      return
    }
    $el['$ps'] && $el['$ps'].update()
  },
} as DirectiveOptions

interface Value {
  options: PerfectScrollbar.Options
  enable: boolean
}
