import { createApp } from 'vue';
import App from './App.vue';
import { themePlugin } from '../src/index';
import './style.css';

const app = createApp(App);

app.use(themePlugin, {
  defaultTheme: 'theme',
});

app.mount('#app');
