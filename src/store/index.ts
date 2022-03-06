import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { User } from '../../types/User'
import { Alert } from '../../types/Alert'
import { Loader } from '../../types/Loader'
import * as MutationTypes from './mutationType'
import createPersistedState from 'vuex-persistedstate'

/**
 * ストアの型を定義する
 *
 * */
export interface State {
  user: User,
  alert: Alert,
  loader: Loader
}

/**
 * ストアオブジェクトを定義
 *
 */
const StateObject = {
  user: { name: '', email: '', id: 0 },
  alert: { hasAlert: false, AlertMessage: '' },
  loader: { isLoading: false }
}

/** storeをprovide/injectするためのキー */
export const key: InjectionKey<Store<State>> = Symbol('')

export default createStore<State>({
  state: StateObject,
  mutations: {
    [MutationTypes.ADD_USER] (state, user: User) {
      state.user = user
    },
    [MutationTypes.ADD_ALERT] (state, alert: Alert) {
      state.alert = alert
    },
    [MutationTypes.SHOW_LOADER] (state, loader: Loader) {
      state.loader = loader
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
  },
  plugins: [createPersistedState(
    {
      key: 'meetApp',
      storage: window.sessionStorage
    })]
})

/** useStoreを使う時にキーの指定を省略するためのラッパー関数 */
export const useStore = () => {
  return baseUseStore(key)
}
