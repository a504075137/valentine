import '@c/toast';
import '@utils/storage';
import '@utils/window';
import '@utils/bus';
import '@utils/filters';
import '@utils/api';
import '@utils/wx';
import '@utils/audio';
import '@directive';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Vconsole from 'vconsole';

if(window.location.href.indexOf("debug")>-1){
	let vConsole = new Vconsole();
	Vue.use(vConsole);	
}


Vue.publicPath = Vue.prototype.publicPath = process.env.BASE_URL;

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
