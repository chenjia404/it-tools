<script setup lang="ts">
import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  kebabCase,
  noCase,
  pascalCase,
  pathCase,
  sentenceCase,
  snakeCase,
  trainCase,
} from 'change-case';
import InputCopyable from '../../components/InputCopyable.vue';
import { createCaseOptions } from './case-converter.models';

const caseOptions = createCaseOptions();

const input = ref('lorem ipsum dolor sit amet');

const formats = computed(() => [
  {
    label: 'Lowercase:',
    value: input.value.toLocaleLowerCase(),
  },
  {
    label: 'Uppercase:',
    value: input.value.toLocaleUpperCase(),
  },
  {
    label: 'Camelcase:',
    value: camelCase(input.value, caseOptions),
  },
  {
    label: 'Capitalcase:',
    value: capitalCase(input.value, caseOptions),
  },
  {
    label: 'Constantcase:',
    value: constantCase(input.value, caseOptions),
  },
  {
    label: 'Dotcase:',
    value: dotCase(input.value, caseOptions),
  },
  {
    label: 'Headercase:',
    value: trainCase(input.value, caseOptions),
  },
  {
    label: 'Nocase:',
    value: noCase(input.value, caseOptions),
  },
  {
    label: 'Paramcase:',
    value: kebabCase(input.value, caseOptions),
  },
  {
    label: 'Pascalcase:',
    value: pascalCase(input.value, caseOptions),
  },
  {
    label: 'Pathcase:',
    value: pathCase(input.value, caseOptions),
  },
  {
    label: 'Sentencecase:',
    value: sentenceCase(input.value, caseOptions),
  },
  {
    label: 'Snakecase:',
    value: snakeCase(input.value, caseOptions),
  },

  {
    label: 'Mockingcase:',
    value: input.value
      .split('')
      .map((char, index) => (index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
      .join(''),
  },
]);

const inputLabelAlignmentConfig = {
  labelPosition: 'left' as const,
  labelWidth: '120px',
  labelAlign: 'right' as const,
};
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="input"
      label="Your string:"
      placeholder="Your string..."
      raw-text
      v-bind="inputLabelAlignmentConfig"
    />

    <div my-16px divider />

    <InputCopyable
      v-for="format in formats"
      :key="format.label"
      :value="format.value"
      :label="format.label"
      mb-1
      v-bind="inputLabelAlignmentConfig"
    />
  </c-card>
</template>
