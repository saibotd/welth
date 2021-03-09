<template>
  <div
    class="select"
    v-click-outside="
      () => {
        open = false
      }
    "
  >
    <div @click="open = !open" class="input">{{ valueLabel }}</div>
    <div class="list" v-show="open">
      <input
        :value="search"
        @input="(e) => (search = e.target.value)"
        ref="search"
        placeholder="search..."
      />
      <ul>
        <li
          v-for="{ value, label } in filteredOptions"
          :key="value"
          @click="() => setValue(value)"
        >
          {{ label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import vClickOutside from 'v-click-outside'
export default {
  props: {
    options: Array,
    value: String,
  },
  data() {
    return {
      open: false,
      search: '',
    }
  },
  created() {
    if (!this.value) this.$emit('input', this.options[0].value)
  },
  computed: {
    valueLabel() {
      if (!this.value) return '-'
      return this.options.find(({ value }) => value == this.value).label
    },
    filteredOptions() {
      if (!this.search.length) return []
      return this.options.filter(({ label }) =>
        label.toLowerCase().startsWith(this.search.toLowerCase())
      )
    },
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  watch: {
    open(newVal) {
      if (newVal)
        this.$nextTick(() => {
          this.$refs.search.focus()
        })
      else this.search = ''
    },
  },
  methods: {
    setValue(value) {
      this.$emit('input', value)
      this.open = false
    },
  },
}
</script>

<style lang="scss" scoped>
.select {
  cursor: unset;
  position: relative;
  .input {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding-right: 20px;
    &::after {
      content: '▼';
      color: dimgray;
      position: absolute;
      right: 10px;
    }
  }
  > .list {
    position: absolute;
    width: 100%;
    left: 0;
    top: 100%;
    background: lightgray;
    border-top: dimgray 1px solid;
    border-bottom: dimgray 1px solid;
    max-height: 30vh;
    overflow-y: auto;
    z-index: 1;
    input {
      width: calc(100% - 16px);
      margin: 8px;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      li {
        display: block;
        padding: 8px;
        &:hover {
          background: dimgray;
          color: lightgray;
        }
      }
    }
  }
}
</style>
