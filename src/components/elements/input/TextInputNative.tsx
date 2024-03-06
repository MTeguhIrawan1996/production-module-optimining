import { TextInput as MantineTextInput, TextInputProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { CommonProps } from '@/types/global';

export type ITextInputNativeProps = {
  control: 'text-input-native';
  name: string;
  labelWithTranslate?: boolean;
} & Omit<TextInputProps, 'name'> &
  CommonProps;

const TextInputNative: React.FC<ITextInputNativeProps> = ({
  control,
  label,
  labelWithTranslate = true,
  description,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');

  return (
    <MantineTextInput
      radius={8}
      w="100%"
      labelProps={{
        style: {
          fontWeight: 400,
          fontSize: 16,
          marginBottom: description ? 2 : 8,
        },
      }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 12 } }}
      autoComplete="off"
      data-control={control}
      description={description}
      label={
        labelWithTranslate
          ? label
            ? t(`components.field.${label}`)
            : null
          : label
      }
      {...rest}
    />
  );
};

export default TextInputNative;
