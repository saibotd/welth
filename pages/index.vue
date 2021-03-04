<template>
  <div class="container">
    <h1>
      <img src="../assets/logo.svg" />
      welth
    </h1>
    <p>welth is a very simple crypto portfolio tracker.</p>
    <nuxt-link class="button" v-if="portfolios" to="/list"
      >Your portfolios</nuxt-link
    >
    <button v-else @click="createPortfolio">Create portfolio</button>
  </div>
</template>
<script>
import localforage from 'localforage'
import short from 'short-uuid'

export default {
  data() {
    return {
      portfolios: null,
    }
  },
  async mounted() {
    this.portfolios = (await localforage.getItem('portfolios')) || null
  },
  methods: {
    async createPortfolio() {
      if (!this.portfolios) this.portfolios = {}
      const id = short.generate()
      this.portfolios[id] = {
        currency: 'usd',
        funds: 12345,
        number_locale: 'en',
        weighted_trend: true,
        title: 'My Welth',
        wallets: [
          { id: '_fiat', val: 420, note: 'Left to spend' },
          { id: '_fiat', val: -69, note: 'Payday!' },
          { id: 'bitcoin', val: 0.1337, symbol: 'BTC', note: 'Cold wallet' },
          { id: 'bitcoin', val: 0.02, symbol: 'BTC' },
          { id: 'ethereum', val: 7, symbol: 'ETH' },
          { id: 'nano', val: 420, symbol: 'NANO' },
          { id: 'cardano', val: 555, symbol: 'ADA' },
        ],
      }
      await localforage.setItem('portfolios', this.portfolios)
      this.$router.push(`/portfolio?id=${id}`)
    },
  },
}
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
  font-family: 'Comic Sans MS', sans-serif;
  img {
    width: 120px;
    margin: auto;
    display: block;
  }
}
.github-ribbon > a {
  background-color: deeppink !important;
}
</style>
