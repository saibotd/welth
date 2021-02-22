<template>
  <div>
    <h1>home</h1>
    <button @click="createPortfolio">Create new</button>
  </div>
</template>
<script>
import localforage from 'localforage'
import short from 'short-uuid'

export default {
  async mounted() {},
  methods: {
    async createPortfolio() {
      let portfolios = await localforage.getItem('portfolios')
      if (!portfolios) portfolios = {}
      const id = short.generate()
      portfolios[id] = {
        currency: 'usd',
        funds: 2000,
        number_locale: 'en',
        weighted_trend: true,
        wallets: [
          { id: '_fiat', val: 300 },
          { id: 'bitcoin', val: 0.1, symbol: 'BTC' },
        ],
      }
      await localforage.setItem('portfolios', portfolios)
      this.$router.push(`/portfolio?id=${id}`)
    },
  },
}
</script>
