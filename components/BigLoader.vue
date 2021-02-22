<template>
  <div class="big-loader">
    <client-only>
      <div>
        <vue-simple-spinner
          :size="96"
          :line-size="6"
          line-fg-color="deeppink"
          line-bg-color="transparent"
        />
      </div>
    </client-only>
  </div>
</template>

<style lang="scss" scoped>
.big-loader {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  > div {
    margin: auto;
  }
}
</style>
