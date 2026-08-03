<script setup lang="ts">
import { useUserLocale } from '../useUserLocale';

const { availableLocales, locale, setLocale } = useUserLocale();

const localesLong: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  no: 'Norwegian',
  pt: 'Português',
  ru: 'Русский',
  uk: 'Українська',
  zh: '中文',
  vi: 'Tiếng Việt',
};

const localeOptions = computed(() =>
  availableLocales.map(code => ({
    label: localesLong[code] ?? code,
    value: code,
  })),
);
</script>

<template>
  <c-select
    :value="locale"
    :options="localeOptions"
    placeholder="Select a language"
    w-100px
    @update:value="setLocale"
  />
</template>
