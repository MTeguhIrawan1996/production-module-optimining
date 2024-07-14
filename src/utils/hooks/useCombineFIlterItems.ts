import * as React from 'react';

export type IIdAndName = {
  id: string;
  name: string;
};

interface IProps<T> {
  data: T[];
  withRest?: boolean;
  combinedId?: string;
  combinedName?: string;
}

export const useCombineFilterItems = <T extends IIdAndName>({
  data,
  combinedId,
  combinedName,
  withRest,
}: IProps<T>) => {
  const renderItems = React.useCallback(
    ({ id, name, ...rest }: T) => {
      if (withRest) {
        return {
          value: id,
          label: name,
          ...rest,
        };
      }
      return {
        value: id,
        label: name,
      };
    },
    [withRest]
  );
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
  withRest,
}: Pick<IProps<T>, 'data' | 'withRest'>) => {
  const renderItems = React.useCallback(
    ({ id, name, ...rest }: T) => {
      if (withRest) {
        return {
          value: id,
          label: name,
          ...rest,
        };
      }
      return {
        value: id,
        label: name,
      };
    },
    [withRest]
  );

  const uncombinedItem = data.map(renderItems);

  return {
    uncombinedItem,
  };
};
