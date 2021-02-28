<template>
  <div class="container">
    <h1>Portfolios</h1>
    <ul>
      <li v-for="(portfolio, id) in portfolios" :key="id">
        <h2>
          <nuxt-link :to="`/portfolio?id=${id}`">{{
            portfolio.title || 'unnamed portfolio'
          }}</nuxt-link>
        </h2>
        <div class="actions">
          <nuxt-link class="button" :to="`/edit?id=${id}`">edit</nuxt-link>
          <nuxt-link class="button" :to="`/export?id=${id}`">export</nuxt-link>
          <a class="button red" @click="rmPortfolio(id)">delete</a>
        </div>
      </li>
    </ul>
    <button @click="createPortfolio()">Add portfolio</button>
  </div>
</template>
<script>
import localforage from 'localforage'
import short from 'short-uuid'

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
    async createPortfolio(portfolioData = null) {
      let portfolios = await localforage.getItem('portfolios')
      if (!portfolios) portfolios = {}
      const id = portfolioData ? portfolioData.id : short.generate()
      portfolios[id] = portfolioData
        ? portfolioData.portfolio
        : {
            title: 'My welth',
            currency: 'usd',
            funds: 5000,
            number_locale: 'en',
            weighted_trend: true,
            wallets: [
              { id: '_fiat', val: 420 },
              { id: 'bitcoin', val: 1, symbol: 'BTC' },
              { id: 'ethereum', val: 10, symbol: 'ETH' },
            ],
          }
      this.portfolios = portfolios
      await localforage.setItem('portfolios', portfolios)
      if (!portfolioData) this.$router.push(`/edit?id=${id}`)
    },
    async rmPortfolio(id) {
      const portfolios = await localforage.getItem('portfolios')
      const portfolio = portfolios[id]
      const deleted = { id, portfolio }
      delete portfolios[id]
      this.portfolios = portfolios
      await localforage.setItem('portfolios', portfolios)
      this.$toast.show(`Removed portfolio "${portfolio.title}"`, {
        duration: 5000,
        action: {
          text: 'Undo',
          onClick: (e, toastObject) => {
            this.createPortfolio(deleted)
            toastObject.goAway(0)
          },
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
ul {
  padding: 0;
  list-style: none;
  li {
    display: block;
    border: rebeccapurple 1px solid;
    border-left: none;
    border-right: none;
    padding: 10px 0;
    margin-top: -1px;
    display: flex;
    align-items: center;
    h2 {
      flex: 1;
      a {
        color: aqua;
      }
    }
    .actions {
      font-size: 80%;
    }
  }
}
</style>
