import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllSampleType } from '@/services/graphql/query/global-select/useReadAllSampleTypes';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type ISampleTypesSelectnputRhfProps = {
  control: 'sample-type-select-input';
  name: string;
} & Omit<
  SelectProps,
  'name' | 'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
> &
  CommonProps;

const SampleTypeSelectInput: React.FC<ISampleTypesSelectnputRhfProps> = ({
  name,
  control,
  label,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });

  const { sampleTypesdata } = useReadAllSampleType({
    variables: {
      limit: null,
      orderDir: 'desc',
      orderBy: 'createdAt',
    },
  });

  const { uncombinedItem } = useFilterItems({
    data: sampleTypesdata ?? [],
  });

  return (
    <Select
      {...field}
      radius={8}
      data={uncombinedItem}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      placeholder={t('commonTypography.chooseSampleType', {
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

export default SampleTypeSelectInput;
