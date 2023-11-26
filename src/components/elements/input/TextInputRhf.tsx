import {
  Flex,
  Stack,
  TextInput as MantineTextInput,
  TextInputProps,
} from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import PrimaryButton, {
  IPrimaryButtonProps,
} from '@/components/elements/button/PrimaryButton';
import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { CommonProps } from '@/types/global';

export type ITextInputProps = {
  control: 'text-input';
  name: string;
  labelWithTranslate?: boolean;
  deleteButtonField?: Omit<IPrimaryButtonProps, 'label'>;
} & Omit<TextInputProps, 'name'> &
  CommonProps;

const TextInputRhf: React.FC<ITextInputProps> = ({
  name,
  control,
  label,
  deleteButtonField,
  labelWithTranslate = true,
  ...rest
}) => {
  const {
    variant = 'light',
    color = 'red',
    ...restDeleteButtonField
  } = deleteButtonField || {};
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });

  return (
    <Stack spacing={8}>
      <Flex w="100%" align="flex-end" gap="sm">
        <MantineTextInput
          {...field}
          radius={8}
          w="100%"
          labelProps={{
            style: { fontWeight: 400, fontSize: 16, marginBottom: 8 },
          }}
          descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
          autoComplete="off"
          data-control={control}
          label={
            labelWithTranslate
              ? label
                ? t(`components.field.${label}`)
                : null
              : label
          }
          {...rest}
        />
        {deleteButtonField ? (
          <PrimaryButton
            label={t('commonTypography.delete', { ns: 'default' })}
            variant={variant}
            color={color}
            {...restDeleteButtonField}
          />
        ) : null}
      </Flex>
      {fieldState && fieldState.error && (
        <FieldErrorMessage color="red">
          {fieldState.error.message}
        </FieldErrorMessage>
      )}
    </Stack>
  );
};

export default TextInputRhf;
