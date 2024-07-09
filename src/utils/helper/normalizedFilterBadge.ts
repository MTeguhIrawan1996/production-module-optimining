import { IMultipleFilter } from '@/components/elements/button/FilterButton';

import { ISelectData } from '@/types/global';

export const normalizedFilterBadge = (data: IMultipleFilter[]) => {
  const newFilter = data.map((v) => {
    const value = {
      data: v.selectItem.data as any,
      value: v.selectItem.value,
      prefix: v.prefix,
    };
    return value;
  });

  const badgeFilter = newFilter?.reduce<string[]>((acc: string[], curr) => {
    if (curr.value) {
      const currentData: ISelectData = curr.data.find(
        (v: ISelectData) => v.value === curr.value
      );
      acc.push(
        curr.prefix ? `${curr.prefix} ${currentData.label}` : currentData.label
      );
    }
    return acc;
  }, []);
  return badgeFilter;
};
