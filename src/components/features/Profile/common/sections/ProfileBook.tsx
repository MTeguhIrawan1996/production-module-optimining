/* eslint-disable no-console */
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  UpdatePasswordModal,
  UserProfileForm,
} from '@/components/elements';

import {
  IUpdateAuthUserPasswordRequest,
  useUpdateAuthUserPassword,
} from '@/services/graphql/mutation/auth/useUpdatePasswordAuthUser';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import {
  IUpdateAuthUser,
  useUpdateAuthUser,
} from '@/services/restapi/auth/useUpdateAuthUser';
import {
  confirmPassword,
  email,
  fullname,
  newPasswordAuthUser,
  oldPassword,
  phoneNumber,
  username,
} from '@/utils/constants/Field/global-field';
import {
  updateAuthUserPasswordSchema,
  updateAuthUserSchema,
} from '@/utils/form-validation/auth/auth-validation';
import {
  errorBadRequestField,
  errorRestBadRequestField,
} from '@/utils/helper/errorBadRequestField';

import { ControllerProps } from '@/types/global';

const ProfileBook = () => {
  const { t } = useTranslation('default');
  const [isOpenUpdatePasswordModal, setIsOpenUpdatePasswordModal] =
    React.useState<boolean>(false);
  const [isDirtyPhoto, setIsDirtyPhoto] = React.useState<boolean>(false);

  /* #   /**=========== methods =========== */
  const methods = useForm<IUpdateAuthUser>({
    resolver: zodResolver(updateAuthUserSchema),
    defaultValues: {
      photo: null,
      name: '',
      email: '',
      phoneNumber: '',
      username: '',
    },
    mode: 'onSubmit',
  });
  const {
    formState: { isDirty },
  } = methods;
  const methodsUpdatePassword = useForm<IUpdateAuthUserPasswordRequest>({
    resolver: zodResolver(updateAuthUserPasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });
  const photo = methods.watch('photo');
  /* #endregion  /**======== methods =========== */

  /* #   /**=========== Query =========== */
  const {
    userAuthData,
    userAuthDataLoading,
    refetch: authUserRefetch,
  } = useReadAuthUser({
    onCompleted: (data) => {
      methods.setValue('name', data.authUser.name);
      methods.setValue('email', data.authUser.email);
      methods.setValue('username', data.authUser.username);
      methods.setValue('phoneNumber', data.authUser.phoneNumber ?? '');
      methods.setValue('photo', data.authUser.photo?.url ?? null);
    },
  });

  const { mutate, isLoading } = useUpdateAuthUser({
    onError: (err) => {
      if (err.response) {
        const errorArry = errorRestBadRequestField(err);
        if (errorArry?.length) {
          errorArry?.forEach(({ name, type, message }) => {
            methods.setError(name, { type, message });
          });
          return;
        }
        notifications.show({
          color: 'red',
          title: 'Gagal',
          message: err.response.data.message,
          icon: <IconX />,
        });
      }
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: 'Profil berhasil diubah',
      });
      authUserRefetch();
    },
  });

  const [executeUpdatePassword, { loading: loadingUpdatePassword }] =
    useUpdateAuthUserPassword({
      onCompleted: () => {
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: t('commonTypography.successUpdatePasswordMessage'),
          icon: <IconCheck />,
        });
        methodsUpdatePassword.reset();
        setIsOpenUpdatePasswordModal((prev) => !prev);
      },
      onError: (error) => {
        if (error.graphQLErrors) {
          const errorArry =
            errorBadRequestField<IUpdateAuthUserPasswordRequest>(error);
          if (errorArry.length) {
            errorArry.forEach(({ name, type, message }) => {
              methodsUpdatePassword.setError(name, { type, message });
            });
            return;
          }
          notifications.show({
            color: 'red',
            title: 'Gagal',
            message: error.message,
            icon: <IconX />,
          });
        }
      },
    });

  /* #endregion  /**======== Query =========== */

  /* #   /**=========== field =========== */
  const profileField = React.useMemo(() => {
    const field: ControllerProps[] = [fullname, username, email, phoneNumber];
    return field;
  }, []);
  const updatePasswordField = React.useMemo(() => {
    const field: ControllerProps[] = [
      oldPassword,
      newPasswordAuthUser,
      confirmPassword,
    ];

    return field;
  }, []);
  /* #endregion  /**======== field =========== */

  /* #   /**=========== HandleSubmit =========== */
  const handleSubmitForm: SubmitHandler<IUpdateAuthUser> = (data) => {
    const { name, email, phoneNumber, username, photo } = data;
    mutate({
      name,
      email,
      photo,
      phoneNumber,
      username,
    });
  };

  const handleSubmitFormUpdatePassword: SubmitHandler<
    IUpdateAuthUserPasswordRequest
  > = async (data) => {
    const { newPassword, oldPassword, confirmPassword } = data;
    await executeUpdatePassword({
      variables: {
        oldPassword,
        newPassword,
        confirmPassword,
      },
    });
  };
  /* #endregion  /**======== HandleSubmit =========== */

  return (
    <DashboardCard
      withBorder
      shadow="sm"
      enebleBack
      paperStackProps={{
        spacing: 'sm',
      }}
      isLoading={userAuthDataLoading}
    >
      <UserProfileForm
        methods={methods}
        field={profileField}
        photo={photo}
        name={userAuthData?.name}
        role={userAuthData?.role.name}
        submitForm={handleSubmitForm}
        loadingSubmitButton={isLoading}
        isDirtyPhoto={() => setIsDirtyPhoto(true)}
        isDirty={isDirty || isDirtyPhoto}
        buttonUpdatePassword={{
          onClick: () => setIsOpenUpdatePasswordModal((prev) => !prev),
        }}
      />
      <UpdatePasswordModal
        field={updatePasswordField}
        methods={methodsUpdatePassword}
        isOpen={isOpenUpdatePasswordModal}
        submitForm={handleSubmitFormUpdatePassword}
        isLoading={loadingUpdatePassword}
        onActionUpdatePassword={() =>
          setIsOpenUpdatePasswordModal((prev) => !prev)
        }
      />
    </DashboardCard>
  );
};

export default ProfileBook;
