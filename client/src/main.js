import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/routes.js';
import components from '@/components/UI/index.js';
import { createPinia } from 'pinia'

//TODO: Вывести список сотрудников, реализовать их CRUD и сделать

const app = createApp(App);
const pinia = createPinia();

components.forEach((component) => {
  app.component(component.name, component);
});

app.use(pinia)
app.use(router);
app.mount('#app');
