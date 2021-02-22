<template>
  <div class="container" v-if="ready">
    <h1>Export {{ portfolio.title }}</h1>
    <input type="url" :value="this.importUrl" />
    <div class="code">
      <qrcode-vue :value="this.importUrl" :size="300" margin="10" level="H" />
    </div>
  </div>
</template>

<script>
import localforage from 'localforage'
import LZString from 'lz-string-uri-fix'

export default {
  head() {
    return {
      title: `Export ${this.portfolio.title}`,
    }
  },
  data() {
    return {
      ready: false,
      portfolio: {},
    }
  },
  async mounted() {
    await this.load()
    this.ready = true
  },
  methods: {
    async load() {
      let portfolios = await localforage.getItem('portfolios')
      this.portfolio = portfolios[this.$route.query.id]
    },
  },
  computed: {
    importUrl() {
      return `${window.location
        .toString()
        .replace('export', 'import')}&data=${encodeURIComponent(
        LZString.compressToEncodedURIComponent(JSON.stringify(this.portfolio))
      )}`
    },
  },
}
</script>
<style lang="scss" scoped>
.code {
  background: white;
  padding: 10px;
  display: inline-block;
  margin: auto;
}
</style>
