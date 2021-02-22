<template>
  <div class="aurora-borealis">
    <span :style="{ backgroundColor: color }"></span>
  </div>
</template>

<script>
export default {
  mounted() {
    this.color = this.defaultColor
    if (!process.client) return
    global.auroraBorealis = this
  },
  props: {
    defaultColor: String,
  },
  data() {
    return {
      color: 'black',
    }
  },
  methods: {
    flash(color) {
      this.color = color
      setTimeout(() => {
        this.color = this.defaultColor
      }, 500)
    },
  },
}
</script>

<style scoped>
.aurora-borealis {
  position: fixed;
  z-index: 0;
  left: 0;
  right: 0;
  top: 0px;
}
.aurora-borealis > span {
  height: 2vh;
  width: 100vw;
  display: block;
  position: absolute;
  left: -50vw;
  top: 0;
  background-color: blueviolet;
  border: black 5px dashed;
  transform: scale(2, 20) skewX(80deg);
  transform-origin: left;
  filter: blur(5px);
  transition: background-color 0.55s;
}
</style>
