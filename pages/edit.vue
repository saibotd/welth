<template>
  <BigLoader v-if="!ready" />
  <div class="container" v-else>
    <h1>Edit {{ portfolio.title }}</h1>
    <form @submit.prevent="submit">
      <h2>Settings</h2>
      <div class="inputs">
        <div class="input">
          <label>Title</label>
          <input v-model="portfolio.title" />
        </div>
        <div class="input">
          <label>Locale (number format)</label>
          <input v-model="portfolio.number_locale" />
        </div>
        <div class="input">
          <label class="checkbox">
            <input type="checkbox" v-model="portfolio.weighted_trend" />
            Weighted trend
          </label>
        </div>
      </div>
      <h2>Funds</h2>
      <div class="inputs">
        <div class="input">
          <label>Funds spend</label>
          <input v-model.number="portfolio.funds" type="number" step="any" />
        </div>
        <div class="input">
          <label>Currency</label>
          <Select v-model="portfolio.currency" :options="currenciesOptions" />
        </div>
      </div>
      <h2>Wallets</h2>
      <div class="wallet" v-for="(wallet, i) in portfolio.wallets" :key="i">
        <div class="input">
          <label>Coin</label>
          <Select v-model="wallet.id" :options="coinsOptions" />
        </div>
        <div class="input">
          <label>Quantity</label>
          <input v-model.number="wallet.val" type="number" step="any" />
        </div>
        <div class="input">
          <label>Note</label>
          <input v-model="wallet.note" />
        </div>
        <button type="button" @click="rmWallet(i)">-</button>
      </div>
      <button type="button" @click="addWallet">add</button>
      <button type="submit">save</button>
    </form>
  </div>
</template>

<script>
import localforage from 'localforage'
import cgClient from '../lib/cgClient'

export default {
  head() {
    return {
      title: `Edit ${this.portfolio.title}`,
    }
  },
  data() {
    return {
      ready: false,
      currencies: [],
      coins: [],
      portfolio: {},
    }
  },
  async mounted() {
    await this.load()
    await this.loadCurrencies()
    await this.loadCoins()
    this.ready = true
  },
  methods: {
    async loadCurrencies() {
      this.currencies = (await localforage.getItem('currencies')) || []
      if (!this.currencies.length) await this._loadCurrencies(true)
      else this._loadCurrencies()
    },
    async loadCoins() {
      this.coins = (await localforage.getItem('coins')) || []
      if (!this.coins.length) await this._loadCoins(true)
      else this._loadCoins()
    },
    async _loadCurrencies(updateState = false) {
      const { data } = await cgClient.get(
        'https://api.coingecko.com/api/v3/simple/supported_vs_currencies'
      )
      await localforage.setItem('currencies', data)
      if (updateState) this.currencies = data
    },
    async _loadCoins(updateState = false) {
      const { data } = await cgClient.get(
        'https://api.coingecko.com/api/v3/coins/list'
      )
      const coins = [{ id: '_fiat' }, ...data]
      await localforage.setItem('coins', coins)
      if (updateState) this.coins = coins
    },
    async load() {
      let portfolios = await localforage.getItem('portfolios')
      this.portfolio = portfolios[this.$route.query.id]
    },
    rmWallet(index) {
      this.portfolio.wallets = this.portfolio.wallets.filter(
        (wallet, i) => i !== index
      )
    },
    addWallet() {
      this.portfolio.wallets.push({
        val: 0,
      })
    },
    async submit() {
      let portfolios = await localforage.getItem('portfolios')
      if (!portfolios) portfolios = {}
      this.portfolio.wallets.forEach((wallet) => {
        if (wallet.id != '_fiat')
          wallet.symbol = this.coins
            .find((coin) => coin.id == wallet.id)
            .symbol.toUpperCase()
      })
      portfolios[this.$route.query.id] = this.portfolio
      await localforage.setItem('portfolios', portfolios)
      this.$router.replace(`/portfolio?id=${this.$route.query.id}`)
    },
  },
  computed: {
    currenciesOptions() {
      return this.currencies.map((item) => ({
        value: item,
        label: item.toUpperCase(),
      }))
    },
    coinsOptions() {
      return this.coins.map((item) => ({
        value: item.id,
        label:
          item.id == '_fiat'
            ? `${this.portfolio.currency.toUpperCase()}`
            : `${item.symbol.toUpperCase()} ${item.name}`,
      }))
    },
  },
}
</script>
<style lang="scss" scoped>
.input {
  input {
    display: block;
    width: 100%;
  }

  label {
    display: block;
    font-weight: bold;
    color: turquoise;
  }
  .checkbox {
    display: flex;
    align-items: center;
    input {
      height: 2.5rem;
      width: 2.5rem;
      margin: 10px;
    }
  }
}
.inputs {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  @media (max-width: 600px) {
    display: block;
  }
  .input {
    width: 50%;
    margin-right: 5px;
    @media (max-width: 600px) {
      width: 100%;
    }
  }
}
.wallet {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: rebeccapurple 1px solid;
  border-left: none;
  border-right: none;
  padding: 10px 0;
  margin-top: -1px;
  @media (max-width: 600px) {
    display: block;
  }
  .input {
    width: 30%;
    margin-right: 5px;
    @media (max-width: 600px) {
      width: 100%;
    }
  }
}
</style>
