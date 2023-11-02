import {
  PasswordInput as MantinePasswordInput,
  TextInputProps,
} from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

export interface IPasswordInputProps extends Omit<TextInputProps, 'name'> {
  control: 'password-input';
  name: string;
}

const PasswordInputRhf: React.FC<IPasswordInputProps> = (props) => {
  const { control, name, label, ...rest } = props;
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });

  return (
    <MantinePasswordInput
      {...field}
      radius={8}
      data-control={control}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      autoComplete="new-password"
      label={t(`components.field.${label}`) ?? null}
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

export default PasswordInputRhf;
