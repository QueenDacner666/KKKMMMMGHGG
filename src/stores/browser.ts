import _ from 'lodash'
import { ActionContext } from 'vuex'
import { IRootState } from '../store'

export default {
  namespaced: true,

  state (): IState {
    return {
      screen: {
        size: null,
        height: 0,
        width: 0,
      },
      mobile: false,
    }
  },

  mutations: {
    screen (state: IState, payload: IMutationsScreenPayload) {
      state.screen = payload.data
    },
    mobile (state: IState, payload: IMutationsMobilePayload) {
      state.mobile = payload.data
    }
  },

  actions: {
    windowResize (context: ActionContext<IState, IRootState>, payload: IActionsWindowResizePayload) {
      const { window } = payload
      const width = _.max([ window.innerWidth, document.documentElement.clientWidth ])
      const height = _.max([ window.innerHeight, document.documentElement.clientHeight ])
      let size = ''

      if (width >= 1200) {
        size = 'lg'
      } else if (width >= 992) {
        size = 'md'
      } else if (width >= 768) {
        size = 'sm'
      } else if (width < 768) {
        size = 'xs'
      }

      context.commit('screen', {
        data: { size, width, height }
      })
    }
  }
}

export interface IState {
  screen: IScreen
  mobile: boolean
}
export interface IScreen {
  size: string
  height: number
  width: number
}
export interface IActionsWindowResizePayload {
  window: Window
  event: UIEvent
}
export interface IMutationsScreenPayload {
  data: IScreen
}
export interface IMutationsMobilePayload {
  data: boolean
}
