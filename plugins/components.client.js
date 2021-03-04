import Vue from 'vue'
import Spinner from 'vue-simple-spinner'
import QrcodeVue from 'qrcode.vue'
import Clipboard from 'v-clipboard'

Vue.use(Clipboard)
Vue.component('vue-simple-spinner', Spinner)
Vue.component('qrcode-vue', QrcodeVue)
