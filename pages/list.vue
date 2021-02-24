<template>
  <div class="container">
    <ul>
      <li v-for="(portfolio, id) in portfolios" :key="id">
        <nuxt-link :to="`/portfolio?id=${id}`">{{
          portfolio.title || 'unnamed portfolio'
        }}</nuxt-link>
        <nuxt-link :to="`/edit?id=${id}`">edit</nuxt-link>
        <nuxt-link :to="`/export?id=${id}`">export</nuxt-link>
        <a @click="rmPortfolio(id)">delete</a>
      </li>
    </ul>
    <button @click="createPortfolio">Create new</button>
  </div>
</template>
<script>
import localforage from 'localforage'

export default {
  data() {
    return {
      portfolios: [],
    }
  },
  async mounted() {
    this.portfolios = await localforage.getItem('portfolios')
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
    async rmPortfolio(id) {
      const portfolios = await localforage.getItem('portfolios')
      delete portfolios[id]
      await localforage.setItem('portfolios', portfolios)
      this.portfolios = portfolios
    },
  },
}
</script>
