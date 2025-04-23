import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/routes.js';
import components from '@/components/UI/index.js';
import { createPinia } from 'pinia'
import VueTheMask from 'vue-the-mask'
import ElementPlus from 'element-plus'
import ru from 'element-plus/dist/locale/ru.mjs'
import 'element-plus/dist/index.css'

//TODO: Сделать 2 и последующие правки

const app = createApp(App);
app.use(VueTheMask)
app.use(ElementPlus, { locale: ru })
const pinia = createPinia();

components.forEach((component) => {
  app.component(component.name, component);
});

app.use(pinia)
app.use(router);
app.mount('#app');
