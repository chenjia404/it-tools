import { createSharedComposable } from '@vueuse/core';
import {
  isSupportedLocale,
  LOCALE_STORAGE_KEY,
} from './i18n.models';

/**
 * 用户语言偏好（全局单例）：
 * - 仅 setLocale（手动选择）写入 storage
 * - 自动检测结果不会被持久化
 * - 跨标签页同步受支持的手动偏好
 */
export const useUserLocale = createSharedComposable(() => {
  const { locale, availableLocales } = useI18n();

  const localeStorage = useStorage<string | null>(LOCALE_STORAGE_KEY, null, undefined, {
    writeDefaults: false,
  });

  watch(localeStorage, (value) => {
    if (!isSupportedLocale(value, availableLocales)) {
      if (value != null) {
        localeStorage.value = null;
      }
      return;
    }

    if (value !== locale.value) {
      locale.value = value;
    }
  });

  function setLocale(value: string) {
    if (!isSupportedLocale(value, availableLocales)) {
      return;
    }

    locale.value = value;
    localeStorage.value = value;
  }

  return {
    locale,
    availableLocales,
    setLocale,
  };
});
