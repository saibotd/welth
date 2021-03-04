<template>
  <BigLoader v-if="!ready" />
  <div class="container" v-else>
    <div class="content">
      <h1>
        <small>
          <LossGain
            :value="((sum - funds) / funds) * 100"
            v-slot:default="slotProps0"
          >
            <Counter
              :from="0"
              :to="slotProps0.value"
              :speed="45"
              v-slot:default="slotProps1"
            >
              {{ formatPercentage(slotProps1.value) }}</Counter
            >
          </LossGain>
        </small>
        <br />
        <Counter
          :from="0"
          :to="sum - funds"
          :speed="45"
          v-slot:default="slotProps"
        >
          {{ formatCurrency(slotProps.value) }}</Counter
        >
      </h1>

      <h2>
        <small>{{ trend >= 0 ? 'trend is up' : 'trend is down' }}</small>
        <br />
        <LossGain :value="trend" v-slot:default="slotProps">
          {{ formatPercentage(slotProps.value) }}</LossGain
        >
      </h2>
      <table>
        <thead>
          <tr>
            <th>coin</th>
            <th>value</th>
            <th>24h±</th>
            <th>qty</th>
            <th>balance</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(wallet, i) in tableData" :key="i">
            <td>
              {{ wallet.symbol }}
            </td>
            <td>
              <UpDownTrend
                :value="prices[wallet.id][currency]"
                v-slot:default="slotProps"
              >
                {{ formatCurrency(slotProps.value) }}
              </UpDownTrend>
            </td>
            <td>
              <LossGain :value="wallet.change" v-slot:default="slotProps">
                {{ formatPercentage(slotProps.value) }}
              </LossGain>
            </td>
            <td>
              {{ wallet.val.toLocaleString(number_locale) }}
            </td>
            <td>
              {{ formatCurrency(wallet.balance) }}
            </td>
          </tr>
        </tbody>
      </table>
      <h3>
        {{ formatCurrency(funds) }} ➔
        <Counter
          :from="funds"
          :to="sum"
          :speed="45"
          v-slot:default="slotProps"
          >{{ formatCurrency(slotProps.value) }}</Counter
        >
      </h3>
      <div class="loader">
        <vue-simple-spinner
          v-show="loading"
          line-fg-color="deeppink"
          line-bg-color="transparent"
        />
        <small v-show="!loading">updated {{ lastUpdateDelta }}s ago</small>
      </div>
    </div>

    <footer>
      <ContextMenu ref="menu">
        <a
          @click="
            () => {
              update()
              $refs.menu.close()
            }
          "
          >Update now</a
        >
        <nuxt-link :to="`/edit?id=${this.$route.query.id}`">Edit</nuxt-link>
        <nuxt-link :to="`/export?id=${this.$route.query.id}`">Export</nuxt-link>
        <nuxt-link to="/list">Portfolios</nuxt-link>
        <nuxt-link to="/">About</nuxt-link>
      </ContextMenu>
    </footer>
  </div>
</template>

<script>
import localforage from 'localforage'
import cgClient from '../lib/cgClient'

export default {
  head() {
    return {
      title: this.title,
    }
  },
  data() {
    return {
      ready: false,
      prices: null,
      lastPrices: null,
      currencyFormat: null,
      percentageFormat: null,
      loading: true,
      lastUpdate: -1,
      timeout: null,
      ticks: 0,
      tickInterval: null,
      title: 'Portfolio',
      wallets: [],
      funds: 0,
      weighted_trend: true,
    }
  },
  async mounted() {
    await this.load()
    this.currencyFormat = new Intl.NumberFormat(this.number_locale, {
      style: 'currency',
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 3,
      currency: this.currency.toUpperCase(),
    })
    this.percentageFormat = new Intl.NumberFormat(this.number_locale, {
      style: 'unit',
      unit: 'percent',
    })
    await this.update()
    window.addEventListener('focus', () => {
      this.update()
    })
    this.tickInterval = setInterval(() => this.ticks++, 1000)
  },
  destroyed() {
    clearTimeout(this.timeout)
    clearInterval(this.tickInterval)
    window.removeEventListener('focus', this.update)
  },
  watch: {
    sum(newVal, oldVal) {
      if (newVal < oldVal) global.auroraBorealis.flash('orangered')
      else if (newVal > oldVal) global.auroraBorealis.flash('greenyellow')
    },
  },
  methods: {
    async load() {
      let portfolios = await localforage.getItem('portfolios')
      const portfolio = portfolios[this.$route.query.id]
      for (const key of Object.keys(portfolio)) {
        this[key] = portfolio[key]
      }
      await localforage.setItem('portfolio', this.$route.query.id)
    },
    async update() {
      this.loading = true
      clearTimeout(this.timeout)
      try {
        const { data: prices } = await cgClient.get(
          `/simple/price?ids=${this.wallets
            .filter(({ id }) => id != '_fiat')
            .map(({ id }) => id)
            .sort(() => Math.random() - 0.5)
            .join(',')}&vs_currencies=${this.currency}&include_24hr_change=true`
        )
        for (const { id } of this.wallets) {
          if (id == '_fiat') {
            prices[id] = {}
            prices[id][`${this.currency}_24h_change`] = 0
            prices[id][this.currency] = 1
          }
        }
        this.prices = prices
        if (JSON.stringify(prices) !== JSON.stringify(this.lastPrices)) {
          console.log('Prices changed, wait 20s for next update')
          this.lastUpdate = Date.now()
          this.timeout = setTimeout(this.update, 20000)
          this.lastPrices = prices
        } else {
          console.log('Prices stayed the same, retry in 5s')
          this.timeout = setTimeout(this.update, 5000)
        }
      } catch (e) {
        console.log('Update failed, try again in 1s')
        this.timeout = setTimeout(this.update, 1000)
        return
      }
      this.loading = false
      this.ready = true
    },
    formatCurrency(num) {
      return this.currencyFormat.format(num)
    },
    formatPercentage(num) {
      return this.percentageFormat.format(num)
    },
  },
  computed: {
    tableData() {
      if (!this.ready) return []
      const idMap = {}
      this.wallets.forEach((wallet) => {
        if (!idMap[wallet.id]) idMap[wallet.id] = { ...wallet }
        else idMap[wallet.id].val += wallet.val
      })
      return Object.values(idMap)
        .map((wallet) => {
          return {
            ...wallet,
            symbol:
              wallet.id == '_fiat'
                ? this.currency.toUpperCase()
                : wallet.symbol,
            change: this.prices[wallet.id][`${this.currency}_24h_change`],
            balance: wallet.val * this.prices[wallet.id][this.currency],
          }
        })
        .sort((a, b) => b.balance - a.balance)
    },
    refreshLabel() {
      if (this.loading) return 'loading'
      return 'reload'
    },
    trend() {
      if (!this.prices) return 0
      let vals = []
      let weight = []
      for (const { id, balance } of this.tableData) {
        if (id == '_fiat') continue
        if (this.weighted_trend) {
          vals.push(
            (balance / this.sum) *
              this.prices[id][`${this.currency}_24h_change`]
          )
          weight.push(balance / this.sum)
        } else vals.push(this.prices[id][`${this.currency}_24h_change`])
      }
      if (this.weighted_trend)
        return vals.reduce((a, b) => a + b) / weight.reduce((a, b) => a + b)
      else return vals.reduce((a, b) => a + b) / vals.length
    },
    sum() {
      if (!this.prices) return this.funds
      let sum = 0
      for (const wallet of this.wallets) {
        sum += wallet.val * this.prices[wallet.id][this.currency]
      }
      return sum
    },
    lastUpdateDelta() {
      this.ticks
      return Math.round((Date.now() - this.lastUpdate) / 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  justify-content: center;
  align-items: center;
  text-align: center;
  .content {
    flex: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    * {
      font-family: monospace;
    }
  }
}
th,
td {
  border: 1px solid darkslategrey;
  padding: 2px;
}
th {
  background: darkslategrey;
}
td {
  text-align: right;
}
td:nth-child(4),
td:first-child {
  text-align: left;
}
table {
  border-collapse: collapse;
}
button {
  min-width: 140px;
}
.loader {
  height: 40px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
