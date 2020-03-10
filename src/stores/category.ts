import _ from 'lodash'
import product from './product'
import { IRootState } from '../store'

export default {
  namespaced: true,

  modules: {
    product,
  },

  state (): IState {
    return {
      map: null,
    }
  },

  mutations: {
    map (state: IState, payload: IMutationsMapPayload) {
      state.map = payload.data
    }
  },

  getters: {
    current (state: IState, getters: IGetters, rootState: IRootState) {
      if (!rootState.route.params.category) return null
      return _.get(state, `map.${rootState.route.params.category}`, null)
    },
  }
}

export interface IState {
  map: {
    [key: string]: ICategory
  }
}

export interface IGetters {
  current: ICategory
}

export interface ICategory {
  index: number
  name: string
  summary: {
    all: number
    hot: number
    image: number
    discuss: number
    change: number
    limited: number
  }
}

export interface ICategoryMap {
  [key: string]: ICategory
}

export interface IMutationsMapPayload {
  data: ICategoryMap,
}
