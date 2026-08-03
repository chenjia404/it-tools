/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest';
import {
  detectBrowserLocale,
  getInitialLocale,
  isSupportedLocale,
  LOCALE_STORAGE_KEY,
  readStoredLocale,
} from './i18n.models';

const availableLocales = ['en', 'de', 'es', 'fr', 'no', 'pt', 'uk', 'zh', 'vi'];

describe('detectBrowserLocale', () => {
  it('精确匹配完整语言标签', () => {
    expect(
      detectBrowserLocale({
        availableLocales,
        languages: ['zh-CN', 'en-US'],
      }),
    ).toBe('zh');
  });

  it('按语言主码匹配', () => {
    expect(
      detectBrowserLocale({
        availableLocales,
        languages: ['fr-FR'],
      }),
    ).toBe('fr');
  });

  it('按 languages 优先级选择第一个可用语言', () => {
    expect(
      detectBrowserLocale({
        availableLocales,
        languages: ['ja-JP', 'de-DE', 'en-US'],
      }),
    ).toBe('de');
  });

  it('挪威语变体映射到 no', () => {
    expect(
      detectBrowserLocale({
        availableLocales,
        languages: ['nb-NO'],
      }),
    ).toBe('no');
  });

  it('下划线形式语言标签可匹配', () => {
    expect(
      detectBrowserLocale({
        availableLocales,
        languages: ['zh_CN'],
      }),
    ).toBe('zh');
  });

  it('无匹配时回退到 fallback', () => {
    expect(
      detectBrowserLocale({
        availableLocales,
        languages: ['ja-JP', 'ko-KR'],
        fallback: 'en',
      }),
    ).toBe('en');
  });

  it('fallback 不可用时使用第一个可用 locale', () => {
    expect(
      detectBrowserLocale({
        availableLocales: ['zh', 'vi'],
        languages: ['ja-JP'],
        fallback: 'en',
      }),
    ).toBe('zh');
  });
});

describe('isSupportedLocale', () => {
  it('仅接受可用列表中的值', () => {
    expect(isSupportedLocale('zh', availableLocales)).toBe(true);
    expect(isSupportedLocale('ru', availableLocales)).toBe(false);
    expect(isSupportedLocale(null, availableLocales)).toBe(false);
    expect(isSupportedLocale('', availableLocales)).toBe(false);
  });
});

describe('readStoredLocale / getInitialLocale', () => {
  afterEach(() => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
  });

  it('优先返回手动保存的有效语言', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'fr');
    expect(readStoredLocale(availableLocales)).toBe('fr');
    expect(getInitialLocale(availableLocales)).toBe('fr');
  });

  it('无效存储值会被清理并回退到浏览器检测', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'ru');
    expect(readStoredLocale(availableLocales)).toBeNull();
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBeNull();
    expect(
      getInitialLocale(availableLocales),
    ).toBe(
      detectBrowserLocale({ availableLocales }),
    );
  });

  it('无存储时使用浏览器语言检测', () => {
    expect(readStoredLocale(availableLocales)).toBeNull();
    expect(getInitialLocale(availableLocales)).toBe(
      detectBrowserLocale({ availableLocales }),
    );
  });
});
