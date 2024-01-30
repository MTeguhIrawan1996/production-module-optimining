import {
  NumberInput as MantineNumberInput,
  NumberInputProps,
  Tooltip,
} from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { CommonProps } from '@/types/global';

export type INumberInputTableRhfProps = {
  control: 'number-input-table-rhf';
  name: string;
  labelWithTranslate?: boolean;
} & Omit<NumberInputProps, 'name'> &
  CommonProps;

const NumberInputTableRhf: React.FC<INumberInputTableRhfProps> = ({
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
    <Tooltip
      label={fieldState?.error?.message || ''}
      hidden={fieldState && fieldState.error ? false : true}
      color="red"
      position="right"
    >
      <MantineNumberInput
        {...field}
        radius={8}
        hideControls={hideControls}
        labelProps={{
          style: { fontWeight: 400, fontSize: 16, marginBottom: 8 },
        }}
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
        error={fieldState && fieldState.error ? true : false}
        {...rest}
      />
    </Tooltip>
  );
};

export default NumberInputTableRhf;
