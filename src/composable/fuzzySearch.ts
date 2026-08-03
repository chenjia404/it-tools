import Fuse, { type IFuseOptions } from 'fuse.js';
import { type MaybeRefOrGetter, computed, toValue } from 'vue';

export { useFuzzySearch };

function useFuzzySearch<Data>({
  search,
  data,
  options = {},
}: {
  search: MaybeRefOrGetter<string>
  data: Data[]
  options?: IFuseOptions<Data> & { filterEmpty?: boolean }
}) {
  const fuse = new Fuse(data, options);
  const filterEmpty = options.filterEmpty ?? true;

  const searchResult = computed<Data[]>(() => {
    const query = toValue(search);

    if (!filterEmpty && query === '') {
      return data;
    }

    return fuse.search(query).map(({ item }) => item);
  });

  return { searchResult };
}
