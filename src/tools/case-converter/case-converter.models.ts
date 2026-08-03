import {
  camelCase,
  split as splitCase,
} from 'change-case';

export { createCaseOptions, toCamelCasePreservingLegacyStrip };

function createCaseOptions() {
  return {
    split: (value: string) =>
      splitCase(value)
        .flatMap(token => token.split(/[^A-Za-zÀ-ÖØ-öø-ÿ]+/gi))
        .filter(Boolean),
  };
}

function toCamelCasePreservingLegacyStrip(value: string) {
  return camelCase(value, createCaseOptions());
}
