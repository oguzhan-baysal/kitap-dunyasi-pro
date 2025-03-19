/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_CURRENCY_API_URL: string
  readonly VITE_CURRENCY_CACHE_DURATION: string
  readonly VITE_DEFAULT_CURRENCY: string
  readonly VITE_DEFAULT_LANGUAGE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 