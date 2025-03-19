/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_CURRENCY_API_URL: string
  readonly VITE_CURRENCY_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 