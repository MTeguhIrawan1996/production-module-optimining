import {
  NumberInput as MantineNumberInput,
  NumberInputProps,
} from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

export type INumberInputProps = {
  control: 'number-input';
  name: string;
} & Omit<NumberInputProps, 'name'>;

const NumberInputRhf: React.FC<INumberInputProps> = ({
  name,
  control,
  label,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');

  const { field, fieldState } = useController({ name });

  return (
    <MantineNumberInput
      {...field}
      radius={8}
      hideControls
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      label={label ? t(`components.field.${label}`) : null}
      parser={(value: string) => value.replace(/[^0-9]/g, '')}
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
