import {
  NumberInput as MantineNumberInput,
  NumberInputProps,
} from '@mantine/core';
import * as React from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { CommonProps } from '@/types/global';

export type IInputSumArrayProps = {
  control: 'input-sum-array';
  name: string;
  labelWithTranslate?: boolean;
  keyObj?: string;
} & Omit<NumberInputProps, 'name'> &
  CommonProps;

const InputSumArray: React.FC<IInputSumArrayProps> = ({
  control,
  label,
  labelWithTranslate = true,
  precision = 2,
  hideControls = true,
  disabled = true,
  name,
  keyObj,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');

  const data = useWatch({
    name,
  });

  const valueMemo = React.useMemo(() => {
    if (Array.isArray(data)) {
      const value = data?.reduce((acc: number, curr: any) => {
        if (typeof curr[`${keyObj}`] === 'number') {
          const objValue = curr[`${keyObj}`] || 0;
          const currentValue = acc + objValue;
          return currentValue;
        }
        if (curr[`${keyObj}`] !== '') {
          const sum = acc + 1;
          return sum;
        }
        return acc;
      }, 0);
      return value;
    }
  }, [data, keyObj]);

  return (
    <MantineNumberInput
      radius={8}
      name={name}
      disabled={disabled}
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
      value={valueMemo || ''}
      {...rest}
    />
  );
};

export default InputSumArray;
