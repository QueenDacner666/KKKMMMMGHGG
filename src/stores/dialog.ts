export interface IState {
  PRODUCT_INFO: boolean
  SHOPPING_CART: boolean
}

export default {
  namespaced: true,

  state (): IState {
    return {
      PRODUCT_INFO: false,
      SHOPPING_CART: false
    }
  },

  mutations: {
    open (state: IState, name) {
      const _state = {}
      _state[name] = true
      state = Object.assign(state, _state)
    },
    close (state: IState, name) {
      const _state = {}
      _state[name] = false
      state = Object.assign(state, _state)
    },
    toggle (state: IState, name) {
      const _state = {}
      _state[name] = !(state[name] === true)

      state = Object.assign(state, _state)
    },
    set (state: IState, { name, value }) {
      const _state = {}
      _state[name] = value === true

      state = Object.assign(state, _state)
    }
  },
}
