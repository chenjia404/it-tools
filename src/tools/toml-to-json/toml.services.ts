import { parse as parseTomlLib, stringify as stringifyTomlLib } from 'smol-toml';
import { isNotThrowing } from '../../utils/boolean';

export { isValidToml, parseToml, stringifyToml, serializeTomlToJson };

const PARSE_OPTIONS = { integersAsBigInt: 'asNeeded' as const };

function parseToml(toml: string) {
  return parseTomlLib(toml, PARSE_OPTIONS);
}

function isValidToml(toml: string): boolean {
  return isNotThrowing(() => parseToml(toml));
}

/** Match legacy iarna-toml behavior: drop null/undefined entries before stringify. */
function stripNullish(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .filter(item => item !== null && item !== undefined)
      .map(item => stripNullish(item));
  }

  if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
    const result: Record<string, unknown> = {};

    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (nested === null || nested === undefined) {
        continue;
      }

      result[key] = stripNullish(nested);
    }

    return result;
  }

  return value;
}

function stringifyToml(value: unknown): string {
  return stringifyTomlLib(stripNullish(value));
}

function serializeTomlToJson(value: unknown): string {
  return JSON.stringify(
    value,
    (_key, nested) => (typeof nested === 'bigint' ? nested.toString() : nested),
    3,
  );
}
