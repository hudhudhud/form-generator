import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import '@/styles/index.scss'
import '@/icons'
import Tinymce from '@/components/tinymce/index.vue'
import 'mint-ui/lib/style.css'
import 'font-awesome/css/font-awesome.min.css'
import FormComponents from '@/components/form-design/form-components'
// import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui'
Vue.use(ElementUI)
// import axios from 'axios'
Vue.component('tinymce', Tinymce)

// console.log(222,axios)
for(let name in FormComponents){
  // console.log(name,FormComponents[name])
  Vue.component(name,FormComponents[name])
}

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
