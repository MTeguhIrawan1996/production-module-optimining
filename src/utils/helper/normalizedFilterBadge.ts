import {
  IFilterButtonProps,
  IFilterDateWithSelect,
  IMultipleFilter,
} from '@/components/elements/button/FilterButton';

import { IFilterDataProps } from '@/utils/store/useFilterDataCommon';

import { ISelectData } from '@/types/global';

interface INewNormalizedFilterbadge {
  filter: IFilterDateWithSelect[];
  data: IFilterDataProps[];
}

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

export const newNormalizedFilterBadge = ({
  data,
  filter,
}: INewNormalizedFilterbadge) => {
  const newFilter = filter.map((v) => {
    const value = {
      data: data.find((o) => o.key === v.selectItem.name)?.data || [],
      value: v.selectItem.value,
      prefix: v.prefix,
    };
    return value;
  });

  const badgeFilter = newFilter?.reduce<string[]>((acc: string[], curr) => {
    if (curr.value) {
      const currentData = curr.data.find((v) => v.id === curr.value);
      if (currentData && currentData.name) {
        acc.push(
          curr.prefix
            ? `${curr.prefix} ${currentData?.name || ''}`
            : currentData?.name || ''
        );
      }
    }
    return acc;
  }, []);
  return badgeFilter;
};

export const normalizedRandomFilter = ({
  filterDateWithSelect,
}: Pick<IFilterButtonProps, 'filterDateWithSelect'>) => {
  const newfilter = filterDateWithSelect?.filter((o) => 'data' in o.selectItem);
  const newData = newfilter
    ?.flatMap((v) => v.selectItem)
    .map((o: any) => {
      const newData = o.data.map((obj: ISelectData) => ({
        id: obj.value,
        name: obj.label,
      }));
      const value = {
        key: o.name || '',
        data: newData,
      };
      return value;
    });

  return {
    newfilter,
    newData,
  };
};
