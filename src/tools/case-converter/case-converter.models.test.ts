import { describe, expect, it } from 'vitest';
import { toCamelCasePreservingLegacyStrip } from './case-converter.models';

describe('case-converter legacy strip behavior', () => {
  it('keeps camelCase token boundaries', () => {
    expect(toCamelCasePreservingLegacyStrip('fooBarBaz')).toBe('fooBarBaz');
    expect(toCamelCasePreservingLegacyStrip('XMLHttpRequest')).toBe('xmlHttpRequest');
  });

  it('strips digits and punctuation like change-case v4 stripRegexp', () => {
    expect(toCamelCasePreservingLegacyStrip('hello 123 world')).toBe('helloWorld');
    expect(toCamelCasePreservingLegacyStrip('version 1.2.3')).toBe('version');
    expect(toCamelCasePreservingLegacyStrip('test2value')).toBe('testValue');
  });
});
