import { Store } from 'vuex'
import { RootState } from '@/types'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<RootState>
  }
}

export { Store, RootState } 