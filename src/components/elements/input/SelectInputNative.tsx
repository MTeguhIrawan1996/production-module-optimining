import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

export type ISelectInputNativeProps = {
  control: 'select-input-native';
} & SelectProps;

const SelectInputNative: React.FC<ISelectInputNativeProps> = ({
  name,
  control,
  label,
  placeholder,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');

  return (
    <Select
      radius="sm"
      name={name}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      label={label ? t(`components.field.${label}`) : null}
      placeholder={
        placeholder
          ? t(`commonTypography.${placeholder}`, { ns: 'default' })
          : undefined
      }
      {...rest}
    />
  );
};

export default SelectInputNative;
