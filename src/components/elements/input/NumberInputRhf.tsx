import {
  NumberInput as MantineNumberInput,
  NumberInputProps,
} from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { CommonProps } from '@/types/global';

export type INumberInputProps = {
  control: 'number-input';
  name: string;
  labelWithTranslate?: boolean;
} & Omit<NumberInputProps, 'name'> &
  CommonProps;

const NumberInputRhf: React.FC<INumberInputProps> = ({
  name,
  control,
  label,
  labelWithTranslate = true,
  precision = 2,
  hideControls = true,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');

  const { field, fieldState } = useController({ name });

  return (
    <MantineNumberInput
      {...field}
      radius={8}
      hideControls={hideControls}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      label={
        labelWithTranslate
          ? label
            ? t(`components.field.${label}`)
            : null
          : label
      }
      parser={(value) => value.replace(/\s|,/g, '.')}
      precision={precision}
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

export default NumberInputRhf;
