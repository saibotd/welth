<template>
  <div class="container" v-if="ready">
    <h1>Export {{ portfolio.title }}</h1>
    <p>
      Copy your portfolio to another browser or mobile device with this
      convenient, yet very long, URL.
    </p>
    <input
      type="url"
      :value="importUrl"
      readonly
      autofocus
      onClick="this.select()"
      onFocus="this.select()"
      v-clipboard="importUrl"
    />
    <button
      v-clipboard="importUrl"
      v-clipboard:success="
        () => $toast.show('URL copied ✓', { duration: 2000 })
      "
    >
      Copy to clipboard
    </button>
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
