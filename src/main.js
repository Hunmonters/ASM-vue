import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { DB } from './services/db'

// import CSS bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

// import dữ liệu seed
import seedData from './data/data.json'
DB.seedOnce(seedData) // seed lần đầu


createApp(App).use(router).mount('#app')