// 1. Make sure to import 'vue' before declaring augmented types
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import Vue, { Component } from 'vue'
import VueRouter from 'vue-router'

// src/vue-shims.d.ts
declare module 'vue-material'

// 2. Specify a file with the types you want to augment
//    Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    $router: VueRouter
  }
}

declare module '*.vue' {
  const component: Component
  export default component
}
