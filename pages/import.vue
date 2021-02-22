<template>
  <div class="container">
    <AuroraBorealis />
  </div>
</template>

<script>
import localforage from 'localforage'
import LZString from 'lz-string-uri-fix'

export default {
  head() {
    return {
      title: 'Import',
    }
  },
  async mounted() {
    const portfolio = JSON.parse(
      LZString.decompressFromEncodedURIComponent(this.$route.query.data)
    )
    console.log(portfolio)
    let portfolios = await localforage.getItem('portfolios')
    if (!portfolios) portfolios = {}
    portfolios[this.$route.query.id] = portfolio
    await localforage.setItem('portfolios', portfolios)
    this.$router.replace(`/portfolio?id=${this.$route.query.id}`)
  },
}
</script>
<style lang="scss" scoped></style>
