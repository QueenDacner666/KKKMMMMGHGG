import _ from 'lodash'
import pako from 'pako'

export default {
  namespaced: true,

  state (): IState {
    return {
      map: null
    }
  },

  mutations: {
    map (state: IState, payload: IMutationsMapPayload) {
      state.map = {
        ...state.map,
        ...payload.data,
      }
    },

    count (state: IState, payload: IMutationsCountPayload) {
      state.map = {
        ...state.map,
        [payload.id]: {
          ...state.map[payload.id],
          count: payload.value,
        }
      }
    },

    drop (state: IState, payload: IMutationsDropPayload) {
      state.map = _.omit(state.map, [ payload.id ])
    }
  },

  getters: {
    isEmpty (state: IState) {
      return _.isEmpty(state.map)
    },

    totalCount (state: IState) {
      return _.reduce(state.map, (total, cart) => _.add(total, cart.count), 0)
    },

    totalPrice (state: IState) {
      return _.reduce(state.map, (total, cart) => _.add(total, _.multiply(cart.count, cart.price)), 0)
    },

    url (state: IState) {
      if (_.isNil(state.map) || _.keys(state.map).length <= 0) return ''
      const jsonMap = JSON.stringify(state.map)
      const zipMap = pako.deflate(jsonMap, { to: 'string' })
      const data = Buffer.from(zipMap).toString('hex')

      if (_.isNil(data)) return ''

      return `/#/share?list=${data}`
    }
  }
}

export interface IState {
  map: ICartMap
}
export interface IGetters {
  isEmpty: boolean
  totalCount: number
  totalPrice: number
  url: string
}
export interface ICartMap {
  [key: string]: ICart
}
export interface ICart {
  count: number
  price: number
  title: string
  uuid: number
  sectionId: string
  updated: Date
  created: Date
}
export interface IMutationsMapPayload {
  data: ICartMap
}
export interface IMutationsCountPayload {
  id: string
  value: number
}
export interface IMutationsDropPayload {
  id: string
}
