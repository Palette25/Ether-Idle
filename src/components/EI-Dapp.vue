<template>
  <div>
 <Index/>
 <EI-component/>
</div>
</template>
<script>
import Index from '@/components/Index'
import EIComponent from '@/components/EI-Component'
export default {
  name: 'EI-Dapp',
  beforeCreate () {
    console.log('registerWeb3 Action dispatched from EI-dapp.vue')
    this.$store.dispatch('registerWeb3')
  },
  components: {
    'Index': Index,
    'EI-component': EIComponent
  }
}
</script>
<style scoped>
body {
  background-color: #E1FFFF;
  padding-right: 20px;
  overflow-y: scroll;
}
</style>
