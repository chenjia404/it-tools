import { describe, expect, it } from 'vitest';
import { isValidToml, parseToml, serializeTomlToJson, stringifyToml } from './toml.services';

describe('toml services', () => {
  it('accepts integers beyond Number.MAX_SAFE_INTEGER', () => {
    const toml = 'big = 9223372036854775807';

    expect(isValidToml(toml)).toBe(true);
    expect(parseToml(toml)).toEqual({ big: 9223372036854775807n });
    expect(serializeTomlToJson(parseToml(toml))).toContain('"9223372036854775807"');
  });

  it('strips null and undefined from arrays before stringify', () => {
    expect(stringifyToml({ a: [1, null, 2, undefined, 3] })).toBe('a = [ 1, 2, 3 ]\n');
  });

  it('strips null object values before stringify', () => {
    expect(stringifyToml({ a: 1, b: null, c: 'x' })).toBe('a = 1\nc = "x"\n');
  });
});
