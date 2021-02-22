<template>
  <span
    ><slot v-bind:value="value">{{ value }}</slot></span
  >
</template>

<script>
export default {
  props: {
    from: Number,
    to: Number,
    speed: Number,
  },
  data() {
    return { value: 0, timeout: 10, _timeout: null, steps: 1 }
  },
  mounted() {
    this.value = this.from
    this.initSteps()
    this.tick()
  },
  watch: {
    from() {
      this.value = this.from
      this.initSteps()
      this.tick()
    },
    to() {
      this.tick()
    },
  },
  methods: {
    initSteps() {
      this.steps = Math.abs(this.value - this.to) / this.speed
    },
    tick() {
      clearTimeout(this._timeout)
      if (Math.abs(this.to - this.value) <= this.steps) {
        this.value = this.to
        return
      }
      if (this.value < this.to) this.value += this.steps
      else if (this.value > this.to) this.value -= this.steps
      this._timeout = setTimeout(() => this.tick(), this.timeout)
    },
  },
}
</script>
