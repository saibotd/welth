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
    value(next, prev) {
      if (prev < next) this.trend = 1
      else if (prev > next) this.trend = -1
    },
  },
  computed: {
    classes() {
      return [
        'number',
        this.trend >= 0
          ? this.trend == 0
            ? 'neutral'
            : 'positive'
          : 'negative',
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.number {
  position: relative;
  padding-right: 0.72em;
  &:after {
    position: absolute;
    font-size: 0.7em;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
  }
}
.positive::after {
  content: '▲';
  color: greenyellow;
  align-items: flex-start;
}
.negative::after {
  content: '▼';
  color: orangered;
  align-items: flex-end;
}
</style>
