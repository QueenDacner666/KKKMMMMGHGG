import _ from 'lodash'
import evaluate from './evaluate'
import { ActionContext } from 'vuex'
import { IRootState } from 'store'

export default {
  namespaced: true,

  modules: {
    evaluate,
  },

  state (): IState {
    return {
      list: [
        { key: 'coolpc', label: '原價屋' },
      ],
    }
  },

  getters: {
    current (state: IState, getters: IGetters, rootState: IRootState) {
      if (!rootState.route.params.company) return null
      return _.find(state.list, { key: rootState.route.params.company })
    }
  }
}


export interface IState {
  list: ICompanyItem[]
}
export interface IGetters {
  current: ICompanyItem
}

export interface ICompanyItem {
  key: string
  label: string
}
export interface IActionCrawlerCoolpcProjectInfoPayload {
  g: number
  d: number
}
