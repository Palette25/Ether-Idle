import Vue from 'vue'
import Router from 'vue-router'
import EI from '@/components/EI-Dapp'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'EI-Dapp',
      component: EI
    }
  ]
})
