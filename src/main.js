import '@utils/window';
import '@c/toast';
import '@utils/storage';
import '@utils/bus';
import '@utils/filters';
import '@utils/api';
import '@utils/wx';
import '@utils/audio';
import '@directive';

import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.publicPath = Vue.prototype.publicPath = process.env.BASE_URL;

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
