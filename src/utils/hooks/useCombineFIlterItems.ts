import * as React from 'react';

type IIdAndName = {
  id: string;
  name: string;
};

interface IProps<T> {
  data: T[];
  combinedId?: string;
  combinedName?: string;
}

export const useCombineFilterItems = <T extends IIdAndName>({
  data,
  combinedId,
  combinedName,
}: IProps<T>) => {
  const renderItems = React.useCallback((value: T) => {
    return {
      label: value.name,
      value: value.id,
    };
  }, []);
  const Items = data
    .filter((value) => value.id !== combinedId || '')
    .map(renderItems);
  const selectedItem = {
    label: combinedName || '',
    value: combinedId || '',
  };
  const combinedItems = [selectedItem, ...Items];

  const uncombinedItem = data.map(renderItems);

  return {
    combinedItems,
    uncombinedItem,
  };
};
export const useFilterItems = <T extends IIdAndName>({ data }: IProps<T>) => {
  const renderItems = React.useCallback((value: T) => {
    return {
      label: value.name,
      value: value.id,
    };
  }, []);

  const uncombinedItem = data.map(renderItems);

  return {
    uncombinedItem,
  };
};
