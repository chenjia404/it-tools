import { createHead } from '@unhead/vue/client';
import { createPinia } from 'pinia';
import { registerSW } from 'virtual:pwa-register';

import { createApp } from 'vue';
import shadow from 'vue-shadow-dom';
import App from './App.vue';

import { i18nPlugin } from './plugins/i18n.plugin';

import { naive } from './plugins/naive.plugin';

import { plausible } from './plugins/plausible.plugin';
import router from './router';
import 'virtual:uno.css';

// 等首屏就绪后再注册 SW，避免与首屏资源争抢带宽
// 使用 typeof，避免 `'requestIdleCallback' in window` 在 TS 中把 else 分支的 window 收窄为 never
const registerServiceWorker = () => registerSW({ immediate: true });
if (typeof window.requestIdleCallback === 'function') {
  window.requestIdleCallback(() => registerServiceWorker(), { timeout: 3000 });
}
else {
  window.addEventListener('load', registerServiceWorker);
}

const app = createApp(App);

app.use(createPinia());
app.use(createHead());
app.use(i18nPlugin);
app.use(router);
app.use(naive);
app.use(plausible);
app.use(shadow);

app.mount('#app');
