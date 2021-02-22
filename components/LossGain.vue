<template>
  <span :class="classes">
    <slot v-bind:value="value">{{ value }}</slot>
  </span>
</template>

<script>
export default {
  props: {
    value: Number,
  },
  data() {
    return {
      trend: 0,
    }
  },
  watch: {
    value(prev, next) {
      if (prev < next) this.trend = 1
      else if (prev > next) this.trend = -1
    },
  },
  computed: {
    classes() {
      return ['number', this.value < 0 ? 'loss' : 'gain']
    },
  },
}
</script>

<style lang="scss" scoped>
.loss {
  color: orangered;
}
.gain {
  color: greenyellow;
}
</style>
