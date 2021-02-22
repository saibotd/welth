<template>
  <div class="progress">
    <span :style="style" />
  </div>
</template>

<script>
export default {
  props: {
    from: Number,
    interval: Number,
    steps: Number,
    loop: Boolean,
  },
  data() {
    return {
      value: 0,
      _interval: null,
    }
  },
  watch: {
    from() {
      this.start()
    },
    interval() {
      this.start()
    },
  },
  mounted() {
    this.start()
  },
  destroyed() {
    clearInterval(this._interval)
  },
  computed: {
    percentage() {
      return (Math.abs(0 - this.value) / this.from) * 100
    },
    style() {
      return { transform: `scaleX(${Math.abs(0 - this.value) / this.from})` }
    },
  },
  methods: {
    start() {
      this.stop()
      this.value = this.from
      this._interval = setInterval(() => this.tick(), this.interval)
    },
    stop() {
      clearInterval(this._interval)
    },
    tick() {
      if (this.value >= 0) this.value -= this.steps
      if (this.value <= -1) {
        this.$emit('done')
        this.stop()
        if (this.loop) setTimeout(() => this.start(), 1000)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.progress {
  position: fixed;
  left: 0;
  right: 0;
  bottom: -30px;
  text-align: center;
  transform: scale(1.2, 10);
  span {
    height: 20px;
    width: 100vw;
    display: inline-block;
    background: blueviolet;
    border: black 5px dashed;
    transition: transform 0.2s;
    transform: scale(0, 1);
    filter: blur(10px);
  }
}
</style>
