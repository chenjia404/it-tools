import { get } from '@vueuse/core';
import type { Ref } from 'vue';
import yaml from 'yaml';

type MaybeRef<T> = T | Ref<T>;

export { formatYaml };

function formatYaml({
  rawYaml,
  sortKeys = false,
  indentSize = 2,
}: {
  rawYaml: MaybeRef<string>
  sortKeys?: MaybeRef<boolean>
  indentSize?: MaybeRef<number>
}) {
  const parsedYaml = yaml.parse(get(rawYaml));

  const formattedYAML = yaml.stringify(parsedYaml, {
    sortMapEntries: get(sortKeys),
    indent: get(indentSize),
  });

  return formattedYAML;
}
