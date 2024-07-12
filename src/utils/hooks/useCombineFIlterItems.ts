import * as React from 'react';

export type IIdAndName = {
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
  const renderItems = React.useCallback(({ id, name, ...rest }: T) => {
    return {
      value: id,
      label: name,
      ...rest,
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
export const useFilterItems = <T extends IIdAndName>({
  data,
}: Pick<IProps<T>, 'data'>) => {
  const renderItems = React.useCallback(({ id, name, ...rest }: T) => {
    return {
      value: id,
      label: name,
      ...rest,
    };
  }, []);

  const uncombinedItem = data.map(renderItems);

  return {
    uncombinedItem,
  };
};
