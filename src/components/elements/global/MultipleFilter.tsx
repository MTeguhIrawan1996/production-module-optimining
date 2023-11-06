import { Select, SelectProps, SimpleGrid } from '@mantine/core';
import * as React from 'react';

export interface IMultipleFilterProps {
  MultipleFilterData: SelectProps[];
  colSpan?: number;
}

const MultipleFilter: React.FC<IMultipleFilterProps> = ({
  MultipleFilterData,
  colSpan = 3,
}) => {
  const renderSelectItem = React.useCallback(
    (value: SelectProps, index: number) => {
      return (
        <Select
          key={index}
          labelProps={{
            style: { fontWeight: 500, fontSize: 14, marginBottom: 8 },
          }}
          styles={(theme) => ({
            item: {
              borderRadius: theme.spacing.xs,
            },
            dropdown: {
              borderRadius: theme.spacing.xs,
            },
          })}
          {...value}
        />
      );
    },
    []
  );

  const selectItems = MultipleFilterData.map(renderSelectItem);

  return (
    <SimpleGrid
      cols={colSpan}
      breakpoints={[
        { maxWidth: 'sm', cols: 1 },
        { maxWidth: 'md', cols: 2 },
      ]}
    >
      {selectItems}
    </SimpleGrid>
  );
};

export default MultipleFilter;
