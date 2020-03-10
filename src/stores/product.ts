import _ from 'lodash'
import info from './product-info'
import { StateChanger } from 'vue-infinite-loading'
import { IRootState, IRootGetters } from '../store'
import { Dispatch, Commit } from 'vuex'

const size = 50

/**
 * 商品搜尋過濾器
 * @param {IProductSection} product 商品
 * @param {string[]} search 搜尋規則
 */
const filterProductBySearch = (product: IProductSection, search: string[]) => {
  _.each(product, (section, key) => {
    const map = _.chain(section.map)
      .mapValues(item => {
        const hasRuleMatched = _.filter(search, rule => {
          // 規則是價格
          if (/^[\$\＄](\d+)?[\~\～](\d+)?/.test(rule)) {
            const price = item.price.special || item.price.source
            const matchBetweenPrice = /[\$\＄](\d+)[\~\～](\d+)/.exec(rule)
            const matchUpperPrice = /[\$\＄](\d+)[\~\～]/.exec(rule)
            const matchDownPrice = /[\$\＄][\~\～](\d+)/.exec(rule)

            return (
              matchBetweenPrice
              &&
              _.parseInt(matchBetweenPrice[1]) < price
              &&
              _.parseInt(matchBetweenPrice[2]) > price
            ) || (
              matchUpperPrice
              &&
              _.parseInt(matchUpperPrice[1]) < price
            ) || (
              matchDownPrice
              &&
              _.parseInt(matchDownPrice[1]) > price
            )
          }
          // 文字搜尋
          return item.name.toLowerCase().indexOf(rule.toLowerCase()) !== -1
        }).length === search.length

        if (!hasRuleMatched) return undefined
        return item
      })
      .omitBy(_.isNil)
      .value()

    if (_.isEmpty(map)) {
      delete product[key]
      return
    }
    product[key].map = map
  })
}

export default {
  namespaced: true,

  modules: {
    info,
  },

  state (): IState {
    return {
      map: null,
      search: null,
      page: 1,
    }
  },

  mutations: {
    map (state: IState, payload: IMutationsMapPayload) {
      state.map = {
        ...state.map,
        ...payload.data
      }
    },

    search (state: IState, payload: IMutationsSearchPayload) {
      state.search = payload.data
    },

    page (state: IState, payload: IMutationsPagePayload) {
      state.page = payload.data
    },
  },

  getters: {
    current (state: IState, getters: IGetters, rootState: IRootState) {
      if (!rootState.route.params.category) return null

      let products: IProductSection = _.chain(state).get(`map.${rootState.route.params.category}.section`).cloneDeep().value()

      if (!products) return null

      if (!_.isEmpty(state.search)) {
        // 商品過濾
        filterProductBySearch(products, state.search)
      }

      return products
    },
  },
}

interface ActionContext<S, G, RS, RG> {
  dispatch: Dispatch
  commit: Commit
  state: S
  getters: G
  rootState: RS
  rootGetters: RG
}

export interface IState {
  map: IProductMap
  search: string[]
  page: number
}

export interface IGetters {
  current: IProductSection
}

export interface IProduct {
  section: IProductSection
  total?: number
  page?: number
}

export interface IProductSection {
  [key: string]: {
    name: string
    map: {
      [key: string]: IProductItem
    }
  }
}

export interface IProductItem {
  index: string
  uuid: number
  name: string
  state: {
    hot: boolean
    unbox: boolean
    image: boolean
    creditCard: boolean
    lastSpecial: boolean
  }
  price: {
    source: number
    special?: number
  }
}

export interface IProductMap {
  /**
   * key as category ID
   */
  [key: string]: IProduct
}

export interface IMutationsMapPayload {
  data: IProductMap,
}
export interface IMutationsSearchPayload {
  data: string[]
}
export interface IMutationsPagePayload {
  data: number
}
export interface IActionsNextPayload {
  state: StateChanger
}
