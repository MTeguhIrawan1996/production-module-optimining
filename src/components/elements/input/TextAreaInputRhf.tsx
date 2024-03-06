import { Textarea as MantineTextArea, TextareaProps } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { CommonProps } from '@/types/global';

export type ITextAreaInput = {
  name: string;
  control: 'text-area-input';
} & Omit<TextareaProps, 'name'> &
  CommonProps;

const TextAreaInput: React.FC<ITextAreaInput> = ({
  name,
  control,
  label,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });

  return (
    <MantineTextArea
      {...field}
      radius={8}
      w="100%"
      labelProps={{
        style: { fontWeight: 400, fontSize: 16, marginBottom: 8 },
      }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      minRows={4}
      autosize
      data-control={control}
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

export default TextAreaInput;
