import _ from 'lodash'
import moment from 'moment'
import Hashids from 'hashids'
import { ActionContext } from 'vuex'
import { IRootState } from 'store'
import { COOLPC_evaluate, COOLPC_productInfo } from '../services/crawler'
import category, { ICategoryMap, ICategory } from './category'
import { IProductMap, IProduct } from './product'

const categoryHashids = new Hashids('category', 5)
const groupHashids = new Hashids('group', 5)
const productHashids = new Hashids('product', 5)

export default {
  namespaced: true,

  modules: {
    category,
  },

  state (): IState {
    return {
      updatedAt: null
    }
  },

  mutations: {
    update (state: IState, payload: IMutationUpdatePayload) {
      state.updatedAt = payload.time
    }
  },

  actions: {
    async GET_evaluate (context: ActionContext<IState, IRootState>, payload: IActionGetEvaluatePayload) {
      // 原價屋
      if (payload.company === 'coolpc') {
        const evaluate = await COOLPC_evaluate()
        const categoryMap: ICategoryMap = {}
        const productMap: IProductMap = {}

        if (context.state.updatedAt && moment(context.state.updatedAt).isSameOrBefore(evaluate.updatedAt)) {
          return
        }

        context.commit('update', {
          time: evaluate.updatedAt,
        })

        _.each(evaluate.categories, ({ groups, ...category }, cindex) => {
          const cid = categoryHashids.encode(cindex)
          categoryMap[cid] = category
          productMap[cid] = {
            section: _.reduce(groups, (gmap, { products, ...group }, gindex) => {
              const gid = groupHashids.encode(cindex, gindex)

              gmap[gid] = {
                ...group,
                map: _.reduce(products, (pmap, product, pindex) => {
                  const pid = productHashids.encode(cindex, gindex, pindex)

                  pmap[pid] = {
                    ...product,
                    uuid: _.get(evaluate, `indexs.g${category.index}.${product.index}`, null)
                  }

                  return pmap
                }, {})
              }

              return gmap
            }, {})
          }
        })

        context.commit('category/map', {
          data: categoryMap,
        })

        context.commit('category/product/map', {
          data: productMap,
        })
      }
    },
  }
}

export interface IState {
  updatedAt: Date
}

export interface IActionGetEvaluatePayload {
  company: string
}

export interface IMutationUpdatePayload {
  time: Date
}
