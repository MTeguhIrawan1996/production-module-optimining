import { Select, SelectProps, SimpleGrid } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

export interface IMultipleFilterProps {
  MultipleFilterData: SelectProps[];
  colSpan?: number;
}

const MultipleFilter: React.FC<IMultipleFilterProps> = ({
  MultipleFilterData,
  colSpan = 3,
}) => {
  const { t } = useTranslation('default');
  const renderSelectItem = React.useCallback(
    ({ placeholder, label, ...value }: SelectProps, index: number) => {
      return (
        <Select
          key={index}
          labelProps={{
            style: { fontWeight: 500, fontSize: 14, marginBottom: 8 },
          }}
          label={label ? t(`commonTypography.${label}`) : null}
          placeholder={
            placeholder
              ? t(`commonTypography.${placeholder}`, { ns: 'default' })
              : undefined
          }
          {...value}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
