import type { Store } from 'vuex'
import type { RootState } from '@/types'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<RootState>
  }
}

export type State = RootState

export interface StoreModuleOptions<S> {
  namespaced?: boolean
  state?: S | (() => S)
  getters?: Record<string, Function>
  mutations?: Record<string, Function>
  actions?: Record<string, Function>
  modules?: Record<string, StoreModuleOptions<any>>
}

export interface StoreOptions<S> extends StoreModuleOptions<S> {
  strict?: boolean
  devtools?: boolean
}

export interface ActionContext<S, R> {
  dispatch: Store<R>['dispatch']
  commit: Store<R>['commit']
  state: S
  getters: any
  rootState: R
  rootGetters: any
} 