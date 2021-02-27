<template>
  <div>
    <AuroraBorealis defaultColor="blueviolet" />
    <div class="wrapper">
      <Nuxt />
    </div>
  </div>
</template>

<style lang="scss">
html,
body {
  margin: 0;
}
body {
  background: black;
  color: lightgray;
  min-height: 100vh;
  * {
    font-family: sans-serif;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    &:focus {
      outline: none;
    }
  }
}
.wrapper {
  position: relative;
  z-index: 1;
}
img {
  max-width: 100%;
  height: auto;
}
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1ex;
  max-width: 800px;
}
button,
.button {
  display: inline-block;
  background: cyan;
  color: black;
  border: 0;
  padding: 5px 10px;
  position: relative;
  text-transform: uppercase;
  font-weight: bold;
  text-decoration: none;
  padding: 0.6em;
  font-size: 100%;
  margin: 0.2em 0;
  text-align: center;
  cursor: pointer;
  &:active,
  &:focus {
    top: 2px;
  }
  &.red {
    background: orangered;
  }
  &.green {
    background: greenyellow;
  }
}
h1 {
  font-size: 3em;
  color: deeppink;
}
h3 {
  color: cyan;
}
.select,
input {
  background: lightgray;
  border: none;
  color: black;
  padding: 8px;
  font-size: 1.2rem;
  margin: 10px 0;
  height: 2.5rem;
  &:focus {
    outline-color: greenyellow;
  }
}
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}
</style>
