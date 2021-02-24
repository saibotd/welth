<template>
  <BigLoader />
</template>
<script>
import localforage from 'localforage'

export default {
  async mounted() {
    const id = await localforage.getItem('portfolio')
    if (id) return this.$router.replace(`/portfolio?id=${id}`)
    const portfolios = await localforage.getItem('portfolios')
    if (portfolios) return this.$router.replace('/list')
    else return this.$router.replace('/')
  },
  methods: {
    async createPortfolio() {
      let portfolios = await localforage.getItem('portfolios')
      if (!portfolios) portfolios = {}
      const id = short.generate()
      portfolios[id] = {
        currency: 'usd',
        funds: 5000,
        number_locale: 'en',
        wallets: [
          { id: '_fiat', val: 420 },
          { id: 'bitcoin', val: 1, symbol: 'BTC' },
          { id: 'ethereum', val: 10, symbol: 'ETH' },
        ],
      }
      await localforage.setItem('portfolios', portfolios)
      this.$router.push(`/portfolio?id=${id}`)
    },
  },
}
</script>
