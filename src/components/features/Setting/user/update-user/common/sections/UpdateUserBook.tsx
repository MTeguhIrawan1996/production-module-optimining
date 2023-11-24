/* eslint-disable no-console */
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  ModalConfirmation,
  UpdatePasswordModal,
  UserProfileForm,
} from '@/components/elements';

import { useUpdateStatusUser } from '@/services/graphql/mutation/user/useUpdateIsActiveUser';
import {
  IUpdateUserPasswordRequest,
  useUpdateUserPassword,
} from '@/services/graphql/mutation/user/useUpdatePassword';
import {
  IManagementRolesData,
  useReadAllManagementRole,
} from '@/services/graphql/query/management-role/useReadAllManagementRole';
import { useReadOneUser } from '@/services/graphql/query/user/useReadOneUser';
import {
  IUpdateUser,
  useUpdateUser,
} from '@/services/restapi/user/useUpdateUser';
import {
  confirmPassword,
  email,
  fullname,
  newPassword,
  phoneNumber,
  username,
} from '@/utils/constants/Field/global-field';
import {
  updateUserPasswordSchema,
  updateUserSchema,
} from '@/utils/form-validation/user/user-validation';
import {
  errorBadRequestField,
  errorRestBadRequestField,
} from '@/utils/helper/errorBadRequestField';

import { ControllerProps } from '@/types/global';

const UpdateUserBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [isOpenUpdatePasswordModal, setIsOpenUpdatePasswordModal] =
    React.useState<boolean>(false);
  const [isOpenActiveOrNonAktifModal, setIsOpenActiveOrNonAktifModal] =
    React.useState<boolean>(false);
  const [isDirtyPhoto, setIsDirtyPhoto] = React.useState<boolean>(false);

  /* #   /**=========== methods =========== */
  const methods = useForm<Omit<IUpdateUser, 'id'>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      photo: null,
      name: '',
      email: '',
      phoneNumber: '',
      username: '',
      roleId: '',
    },
    mode: 'onSubmit',
  });
  const {
    formState: { isDirty },
  } = methods;
  const photo = methods.watch('photo');

  console.log(photo);
  console.log(methods.formState.errors);

  const methodsUpdatePassword = useForm<Omit<IUpdateUserPasswordRequest, 'id'>>(
    {
      resolver: zodResolver(updateUserPasswordSchema),
      defaultValues: {
        password: '',
        confirmPassword: '',
      },
      mode: 'onSubmit',
    }
  );
  /* #endregion  /**======== methods =========== */

  /* #   /**=========== Query =========== */
  const { userData, userDataLoading, userDataRefetch } = useReadOneUser({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: (data) => {
      methods.setValue('name', data.user.name);
      methods.setValue('email', data.user.email);
      methods.setValue('username', data.user.username);
      methods.setValue('phoneNumber', data.user.phoneNumber ?? '');
      methods.setValue('photo', data.user.photo?.url ?? null);
      methods.setValue('roleId', data.user.role.id ?? null);
    },
  });
  const { rolesData, rolesLoading } = useReadAllManagementRole({
    variables: {
      limit: null,
      orderBy: null,
      orderDir: null,
      page: null,
      search: null,
    },
  });
  const [executeUpdateStatus, { loading }] = useUpdateStatusUser({
    onCompleted: (data) => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: data.updateStatusUser.isActive
          ? t('user.successUpdateStatusActiveMessage')
          : t('user.successUpdateStatusNonActiveMessage'),
        icon: <IconCheck />,
      });
      userDataRefetch();
      setIsOpenActiveOrNonAktifModal((prev) => !prev);
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        notifications.show({
          color: 'red',
          title: 'Gagal',
          message: error.message,
          icon: <IconX />,
        });
        setIsOpenActiveOrNonAktifModal((prev) => !prev);
      }
    },
  });
  const { mutate, isLoading } = useUpdateUser({
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
        message: 'Data user berhasil diubah',
      });
      userDataRefetch();
      router.push('/setting/user');
    },
  });
  const [executeUpdatePassword, { loading: loadingUpdatePassword }] =
    useUpdateUserPassword({
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
            errorBadRequestField<Omit<IUpdateUserPasswordRequest, 'id'>>(error);
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

  /* #   /**=========== Field =========== */
  const roleCallback = React.useCallback((value: IManagementRolesData) => {
    const data = {
      value: value.id,
      label: value.name,
    };
    return data;
  }, []);

  const roleItem = rolesData?.map(roleCallback);

  const profileField = React.useMemo(() => {
    const field: ControllerProps[] = [
      fullname,
      username,
      email,
      phoneNumber,
      {
        control: 'select-input',
        name: 'roleId',
        label: 'role',
        withAsterisk: true,
        data: roleItem ?? [],
        placeholder: rolesLoading ? 'Memuat...' : 'Pilih Role',
      },
    ];

    return field;
  }, [roleItem, rolesLoading]);
  const updatePasswordField = React.useMemo(() => {
    const field: ControllerProps[] = [newPassword, confirmPassword];
    return field;
  }, []);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleClick =========== */
  const handleActiveOrNonactiveModal = () => {
    setIsOpenActiveOrNonAktifModal((prev) => !prev);
  };
  const handleActiveOrNonactiveAction = async () => {
    await executeUpdateStatus({
      variables: {
        id,
        status: userData?.isActive ? false : true,
      },
    });
  };

  const handleSubmitForm: SubmitHandler<Omit<IUpdateUser, 'id'>> = (data) => {
    const { name, email, phoneNumber, roleId, username, photo } = data;
    mutate({
      id,
      name,
      email,
      photo,
      roleId,
      phoneNumber,
      username,
    });
  };
  const handleSubmitFormUpdatePassword: SubmitHandler<
    Omit<IUpdateUserPasswordRequest, 'id'>
  > = async (data) => {
    const { password, confirmPassword } = data;
    await executeUpdatePassword({
      variables: {
        id,
        password,
        confirmPassword,
      },
    });
  };
  /* #endregion  /**======== HandleClick =========== */

  return (
    <DashboardCard
      withBorder
      shadow="sm"
      isLoading={userDataLoading}
      paperStackProps={{
        spacing: 'sm',
      }}
    >
      <UserProfileForm
        methods={methods}
        field={profileField}
        photo={photo}
        name={userData?.name}
        role={userData?.role.name}
        submitForm={handleSubmitForm}
        enebleBackBottomInner
        loadingSubmitButton={isLoading}
        isDirtyPhoto={() => setIsDirtyPhoto(true)}
        isDirty={isDirty || isDirtyPhoto}
        buttonUpdatePassword={{
          onClick: () => setIsOpenUpdatePasswordModal((prev) => !prev),
        }}
        buttonAktifOrNonaktifUser={{
          buttonVariant: userData?.isActive ? 'nonaktifUser' : 'aktifUser',
          color: userData?.isActive ? 'red' : 'brand',
          onClick: handleActiveOrNonactiveModal,
        }}
      />
      {/* Nonaktif Modal */}
      <ModalConfirmation
        isOpenModalConfirmation={isOpenActiveOrNonAktifModal}
        actionModalConfirmation={handleActiveOrNonactiveModal}
        size="md"
        radius="md"
        actionButton={{
          label: userData?.isActive
            ? t('user.nonActiveUser')
            : t('user.activeUser'),
          color: userData?.isActive ? 'red' : 'brand',
          onClick: handleActiveOrNonactiveAction,
          loading: loading,
        }}
        backButton={{
          label: t('commonTypography.cancelled'),
        }}
        modalHeader={{
          pb: 'xs',
        }}
        modalType={{
          type: 'default',
          title: (
            <Stack spacing={2} pb="xs">
              <Text fw={700} fz={18} color="dark.4" align="center">
                {userData?.isActive
                  ? t('commonTypography.modalNonActiveTitle')
                  : t('commonTypography.modalActiveTitle')}
              </Text>
              <Text fw={300} fz={14} color="dark.4" align="center">
                {userData?.name}
              </Text>
              <Text fw={300} fz={14} color="dark.4" align="center">
                {userData?.role.name}
              </Text>
            </Stack>
          ),
          description: (
            <Text fw={400} fz={10} color="gray.6" align="center">
              {userData?.isActive
                ? t('commonTypography.modalNonActiveDescription')
                : t('commonTypography.modalNonActiveDescription')}
            </Text>
          ),
        }}
      />
      <UpdatePasswordModal
        field={updatePasswordField}
        methods={methodsUpdatePassword}
        isOpen={isOpenUpdatePasswordModal}
        submitForm={handleSubmitFormUpdatePassword}
        onActionUpdatePassword={() =>
          setIsOpenUpdatePasswordModal((prev) => !prev)
        }
        isLoading={loadingUpdatePassword}
      />
    </DashboardCard>
  );
};

export default UpdateUserBook;
