// 1. Make sure to import 'vue' before declaring augmented types
/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import Vue, { Component } from 'vue'
// These lines are required to have $store ans $router properly added to a vue instance
import Vuex from 'vuex'
import VueRouter from 'vue-router'
/* eslint-enable @typescript-eslint/no-unused-vars, no-unused-vars */

// src/vue-shims.d.ts
// declare module 'vue-material'

// // 2. Specify a file with the types you want to augment
// //    Vue has the constructor type in types/vue.d.ts
// declare module 'vue/types/vue' {
//   // 3. Declare augmentation for Vue
//   // interface Vue {

//   // }
// }
