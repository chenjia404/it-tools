/** 仅在用户手动选择语言时写入，避免把自动检测结果当成偏好 */
export const LOCALE_STORAGE_KEY = 'userLocale';

/** 浏览器语言到应用 locale 的别名映射（如挪威语变体） */
const localeAliases: Record<string, string> = {
  'nb': 'no',
  'nn': 'no',
  'nb-no': 'no',
  'nn-no': 'no',
};

export { detectBrowserLocale, getInitialLocale, isSupportedLocale, readStoredLocale };

function isSupportedLocale(
  locale: string | null | undefined,
  availableLocales: readonly string[],
): locale is string {
  return !!locale && availableLocales.includes(locale);
}

function resolveLocaleCandidate(
  language: string,
  localeSet: Map<string, string>,
): string | undefined {
  // 统一 BCP 47：zh_CN → zh-cn，再按主码匹配
  const normalized = language.toLowerCase().replace(/_/g, '-');
  const aliased = localeAliases[normalized] ?? normalized;

  const exact = localeSet.get(aliased);
  if (exact) {
    return exact;
  }

  const base = aliased.split('-')[0] ?? aliased;
  const baseAliased = localeAliases[base] ?? base;
  return localeSet.get(baseAliased);
}

/**
 * 根据浏览器语言列表匹配可用 locale。
 * 优先精确匹配（含区域），再匹配语言主码；均无匹配时回退 fallback。
 */
function detectBrowserLocale({
  availableLocales,
  languages = typeof navigator === 'undefined'
    ? []
    : [...(navigator.languages ?? []), navigator.language].filter(Boolean),
  fallback = 'en',
}: {
  availableLocales: readonly string[];
  languages?: readonly string[];
  fallback?: string;
}): string {
  const localeSet = new Map(
    availableLocales.map(locale => [locale.toLowerCase(), locale]),
  );

  for (const language of languages) {
    const matched = resolveLocaleCandidate(language, localeSet);
    if (matched) {
      return matched;
    }
  }

  return localeSet.get(fallback.toLowerCase()) ?? availableLocales[0] ?? fallback;
}

/** 读取用户手动保存的语言；无效值会清理，避免污染后续逻辑 */
function readStoredLocale(availableLocales: readonly string[]): string | null {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isSupportedLocale(stored, availableLocales)) {
      return stored;
    }
    if (stored != null) {
      localStorage.removeItem(LOCALE_STORAGE_KEY);
    }
  }
  catch {
    // 隐私模式等环境下 localStorage 可能不可用
  }

  return null;
}

/**
 * 获取初始语言：手动选择优先，否则按浏览器语言自动识别。
 */
function getInitialLocale(availableLocales: readonly string[]): string {
  return readStoredLocale(availableLocales) ?? detectBrowserLocale({ availableLocales });
}
