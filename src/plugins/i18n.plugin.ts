import type { Plugin } from 'vue';
import messages from '@intlify/unplugin-vue-i18n/messages';
import { get } from '@vueuse/core';
import { createI18n } from 'vue-i18n';
import { getInitialLocale } from '@/modules/i18n/i18n.models';

const availableLocales = Object.keys(messages ?? {});
const initialLocale = getInitialLocale(availableLocales);

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages,
});

export const i18nPlugin: Plugin = {
  install: (app) => {
    app.use(i18n);
  },
};

export function translate(localeKey: string) {
  const hasKey = i18n.global.te(localeKey, get(i18n.global.locale));
  return hasKey ? i18n.global.t(localeKey) : localeKey;
}
