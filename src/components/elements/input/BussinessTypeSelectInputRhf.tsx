/* eslint-disable unused-imports/no-unused-vars */
import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllBussinessTypes } from '@/services/graphql/query/global-select/useReadAllBussinessTypes';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type IBussinessTypesSelectInputRhfProps = {
  control: 'bussiness-types-select-input';
  name: string;
} & Omit<
  SelectProps,
  'name' | 'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
> &
  CommonProps;

const BussinessTypeSelectInputRhf: React.FC<
  IBussinessTypesSelectInputRhfProps
> = ({ name, control, label, defaultValue, ...rest }) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });

  const { companyBusinessTypesdata } = useReadAllBussinessTypes({
    variables: {
      limit: null,
      orderDir: 'desc',
    },
  });

  const { uncombinedItem } = useFilterItems({
    data: companyBusinessTypesdata ?? [],
  });

  return (
    <Select
      {...field}
      radius={8}
      data={uncombinedItem}
      defaultValue={defaultValue}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      placeholder={t('commonTypography.chooseBusinessType', {
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

export default BussinessTypeSelectInputRhf;
