import { zodResolver } from '@hookform/resolvers/zod';
import { Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { SignInResponse, useSession } from 'next-auth/react';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AuthGlobalForm } from '@/components/elements';

import { useReadPermissionUser } from '@/services/graphql/query/auth/useReadPermission';
import { ILogin, useLogin } from '@/services/next-auth/login/useLogin';
import authField from '@/utils/constants/Field/auth-field';
import { authValidationSchema } from '@/utils/form-validation/auth/auth-validation';

import { IErrorResponseExtensionNextAuth } from '@/types/global';

const AuthBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const { data: session, update } = useSession();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const methods = useForm<ILogin>({
    resolver: zodResolver(authValidationSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const { data, mutate } = useLogin({
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
      if (newError.code === 'UNAUTHENTICATED') {
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

  useReadPermissionUser({
    skip: !data || !data.ok,
    onCompleted: (res) => {
      if (res && session) {
        try {
          const updateSession = async () => {
            await update({
              ...session,
              user: {
                ...session?.user,
                permission: res.authUser?.role?.permissions?.data,
                role: res.authUser?.role?.slug,
              },
            });
          };
          updateSession();
          router.push('/dashboard');
        } catch (err) {
          return;
        }
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
