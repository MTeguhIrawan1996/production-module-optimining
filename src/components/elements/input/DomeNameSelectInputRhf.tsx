import { Select, SelectProps } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllDome } from '@/services/graphql/query/stockpile-master/useReadAllDome';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type IDomeNameSelectInputRhfProps = {
  control: 'domename-select-input';
  name: string;
  labelValue?: string;
  stockpileId?: string | null;
  limit?: number | null;
  skipQuery?: boolean;
  skipSearchQuery?: boolean;
} & Omit<
  SelectProps,
  'name' | 'data' | 'onSearchChange' | 'searchValue' | 'placeholder' | 'limit'
> &
  CommonProps;

const DomeNameSelectInputRhf: React.FC<IDomeNameSelectInputRhfProps> = ({
  name,
  control,
  label,
  labelValue,
  defaultValue,
  stockpileId = null,
  limit = 15,
  skipQuery = false,
  skipSearchQuery = false,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(searchTerm, 400);
  const currentValue = field.value === '' ? null : field.value;

  const { domeData } = useReadAllDome({
    variables: {
      limit: limit,
      orderDir: 'desc',
      orderBy: 'createdAt',
      search: searchQuery === '' ? null : searchQuery,
      stockpileId: stockpileId === '' ? null : stockpileId,
    },
    skip: skipQuery,
  });

  const { combinedItems, uncombinedItem } = useCombineFilterItems({
    data: domeData ?? [],
    combinedId: defaultValue ?? '',
    combinedName: labelValue,
  });

  return (
    <Select
      {...field}
      radius={8}
      data={!currentValue || !defaultValue ? uncombinedItem : combinedItems}
      defaultValue={defaultValue}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      onSearchChange={!skipSearchQuery ? setSearchTerm : undefined}
      searchValue={!skipSearchQuery ? searchTerm : undefined}
      data-control={control}
      placeholder={t('commonTypography.chooseDomeName', {
        ns: 'default',
      })}
      label={label ? t(`components.field.${label}`) : null}
      error={
        fieldState &&
        fieldState.error && (
          <FieldErrorMessage>{fieldState.error.message}</FieldErrorMessage>
        )
      }
      {...rest}
    />
  );
};

export default DomeNameSelectInputRhf;
