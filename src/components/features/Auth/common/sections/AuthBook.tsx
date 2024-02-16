import { zodResolver } from '@hookform/resolvers/zod';
import { Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { SignInResponse } from 'next-auth/react';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AuthGlobalForm } from '@/components/elements';

import { ILogin, useLogin } from '@/services/next-auth/login/useLogin';
import authField from '@/utils/constants/Field/auth-field';
import { authValidationSchema } from '@/utils/form-validation/auth/auth-validation';

import { IErrorResponseExtensionNextAuth } from '@/types/global';

const AuthBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const methods = useForm<ILogin>({
    resolver: zodResolver(authValidationSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const { mutate } = useLogin({
    onSuccess: () => {
      router.push('/dashboard');
    },
    onError: (err: SignInResponse) => {
      setIsLoading(false);
      if (err.error === 'CredentialsSignin') {
        notifications.show({
          color: 'red',
          title: 'Login gagal',
          message: 'Terjadi Kesalahan',
          icon: <IconX />,
        });
        return;
      }
      const newError: IErrorResponseExtensionNextAuth = JSON.parse(
        err.error as string
      );
      if (newError.originalError) {
        notifications.show({
          color: 'red',
          title: 'Login gagal',
          message: newError.originalError.message,
          icon: <IconX />,
        });
        return;
      }
    },
  });

  const onSubmitForm: SubmitHandler<ILogin> = (value) => {
    setIsLoading(true);
    mutate({
      usernameOrEmail: value.usernameOrEmail,
      password: value.password,
    });
  };

  return (
    <Box w="100%">
      <FormProvider {...methods}>
        <AuthGlobalForm
          field={authField}
          methods={methods}
          submitButton={{
            label: t('auth.button.login'),
            onSubmitForm,
            loading: isLoading,
          }}
        />
      </FormProvider>
    </Box>
  );
};

export default AuthBook;
