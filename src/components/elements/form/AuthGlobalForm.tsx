import { ButtonProps, Divider, Stack } from '@mantine/core';
import * as React from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';

import { FormController, PrimaryButton } from '@/components/elements';

import { ControllerProps } from '@/types/global';

interface IAuthGlobalFormProps {
  methods: UseFormReturn<any>;
  field: ControllerProps[];
  submitButton: {
    label?: string;
    onSubmitForm: SubmitHandler<any>;
  } & ButtonProps;
  secondButton?: {
    label?: string;
    onClickSecondButton?: () => void;
  } & ButtonProps;
}

const AuthGlobalForm: React.FC<IAuthGlobalFormProps> = (props) => {
  const { field, methods, submitButton, secondButton } = props;
  const {
    label: labelSubmit,
    onSubmitForm,
    ...restSubmitButton
  } = submitButton;
  const {
    label: labelSecondButton,
    onClickSecondButton,
    ...restSecondButton
  } = secondButton || {};

  return (
    <form onSubmit={methods.handleSubmit(onSubmitForm)}>
      <Stack spacing={20}>
        {field.map(({ name, ...val }, i) => (
          <FormController {...val} name={name} key={i} />
        ))}
      </Stack>
      <Stack spacing={8} mt="xl" justify="center" align="center">
        <PrimaryButton
          label={labelSubmit ?? 'Submit'}
          loading={secondButton?.loading}
          type="submit"
          w={140}
          radius="sm"
          {...restSubmitButton}
        />
        {secondButton ? (
          <>
            <PrimaryButton
              label={labelSecondButton ?? 'Second Button'}
              color="blue.3"
              onClick={onClickSecondButton}
              type="button"
              {...restSecondButton}
            />
            <Divider />
          </>
        ) : null}
      </Stack>
    </form>
  );
};

export default AuthGlobalForm;
