import Vue from 'vue'
import Vuex from 'vuex'
import { Route } from 'vue-router'
import cart, { IState as ICartState, IGetters as ICartGetters } from './stores/cart'
import dialog, { IState as IDialogState } from './stores/dialog'
import browser, { IState as IBrowserState } from './stores/browser'
import company, { IState as ICompanyState, IGetters as ICompanyGetters } from './stores/company'
import { IState as IEvaluateState } from './stores/evaluate'
import { IState as ICategoryState, IGetters as ICategoryGetters } from './stores/category'
import { IState as IProductState, IGetters as IProductGetters } from './stores/product'
import { IState as IProductInfoState } from './stores/product-info'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    browser,
    cart,
    company,
    dialog,
  },
})

export interface IRootState {
  route: Route
  browser: IBrowserState
  cart: ICartState
  dialog: IDialogState
  company: ICompanyStateIncludeModules
}
interface IEvaluateStateIncludeModules extends IEvaluateState {
  category: ICategoryStateIncludeModules
}
interface ICompanyStateIncludeModules extends ICompanyState {
  evaluate: IEvaluateStateIncludeModules
}
interface ICategoryStateIncludeModules extends ICategoryState {
  product: IProductStateIncludeModules
}
interface IProductStateIncludeModules extends IProductState {
  info: IProductInfoState
}
export interface IRootGetters {
  cart: ICartGetters
  company: ICompanyGettersIncludeModules
}
interface ICompanyGettersIncludeModules {
  category: ICategoryGettersIncludeModules
}
interface ICategoryGettersIncludeModules extends ICategoryGetters {
  product: IProductGetters
}
