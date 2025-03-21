/// <reference types="vite/client" />

import { Component } from '@vue/runtime-core'

declare module '*.vue' {
  const component: Component
  export default component
} 