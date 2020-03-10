import _ from 'lodash'
import moment from 'moment'
import { ActionContext } from 'vuex'
import { IRootState } from '../store'
import { COOLPC_productInfo } from '../services/crawler'
import { IProduct } from './product'

export default {
  namespaced: true,

  state (): IState {
    return {
      current: null,
      map: null,
    }
  },

  mutations: {
    map (state: IState, payload: IMutationsMapPayload) {
      state.map = {
        ...state.map,
        ...payload.data,
      }
    },
    current (state: IState, payload: IMutationsCurrentPayload) {
      state.current = payload.data
    }
  },

  actions: {
    async GET_productInfo (context: ActionContext<IState, IRootState>, payload: IActionsGetProductInfoPayload) {
      const current: IProductInfo = _.get(context.state, `map.${payload.id}`, null)
      const isCacheOutOfTime: boolean = current && current.date && !moment(current.date).add(3, 'h').isAfter()

      let _current = null
      if (!current || isCacheOutOfTime) {
        const info = await COOLPC_productInfo(1, payload.uuid)
        _current = {
          image: info.image,
          detail: info.detail,
          date: new Date(),
        }

        context.commit('map', {
          data: {
            [payload.id]: _current
          },
        })
      }

      context.commit('current', {
        data: _current || current
      })
    },
  },
}


export interface IState {
  current: IProductInfo
  map: IProductInfoMap
}

export interface IProductInfo {
  image: string
  detail: {
    value: string
  }[]
  date: Date
}

export interface IProductInfoMap {
  [key: string]: IProductInfo
}

export interface IMutationsMapPayload {
  data: IProductInfoMap
}

export interface IMutationsCurrentPayload {
  data: IProductInfo
}

export interface IActionsGetProductInfoPayload {
  id: string
  uuid: number
}
