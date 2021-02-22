<template>
  <div :class="classes" v-click-outside="close">
    <nav class="menu">
      <slot></slot>
    </nav>
    <div class="icon" @click="open = !open"><img src="/logo.svg" /></div>
  </div>
</template>

<script>
import vClickOutside from 'v-click-outside'

export default {
  data() {
    return { open: false }
  },
  props: {
    icon: String,
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  methods: {
    close() {
      this.open = false
    },
  },
  computed: {
    classes() {
      return ['context-menu', this.open ? 'open' : 'closed']
    },
  },
}
</script>

<style lang="scss" scoped>
.context-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  &.closed .menu {
    transform: translateY(80%) scale(0.2);
    opacity: 0;
    pointer-events: none;
    touch-action: none;
  }
  &.open .menu {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
.icon {
  width: 3.5rem;
  height: 3.5rem;
  position: relative;
  z-index: 3;
  cursor: pointer;
  > img {
    width: 100%;
  }
}
.menu {
  position: absolute;
  bottom: 5rem;
  background: deeppink;
  display: flex;
  flex-direction: column-reverse;
  text-transform: uppercase;
  padding: 10px 0;
  min-width: 200px;
  max-width: 100vw;
  z-index: 2;
  a {
    font-size: 1.2rem;
    font-weight: bold;
    padding: 10px 20px;
    display: block;
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  transition: transform 0.4s, opacity 0.3s;
  &:after {
    content: ' ';
    position: absolute;
    left: 50%;
    width: 1rem;
    height: 1rem;
    background: deeppink;
    bottom: -0.5rem;
    margin-left: -0.5rem;
    transform: rotate(45deg);
    z-index: -1;
  }
}
</style>
