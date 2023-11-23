import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, Group, Paper, RadioProps, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { IconChevronLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  FormController,
  PrimaryButton,
  RadioInputRhf,
} from '@/components/elements';

import {
  IManagementRolesData,
  useReadAllManagementRole,
} from '@/services/graphql/query/management-role/useReadAllManagementRole';
import {
  ICreateUserValues,
  useCreateUser,
} from '@/services/restapi/user/useCreateUser';
import {
  confirmPassword,
  email,
  name,
  password,
  phoneNumber,
  username,
} from '@/utils/constants/Field/global-field';
import { createUserSchema } from '@/utils/form-validation/user/user-validation';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';

import { ControllerGroup } from '@/types/global';

const CreateUserBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const methods = useForm<ICreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      photo: [],
      roleId: '',
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
    mode: 'onBlur',
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

  const { mutate, isLoading } = useCreateUser({
    onError: (err) => {
      if (err.response) {
        const errorArry = errorRestBadRequestField(err);
        errorArry?.forEach(({ name, type, message }) => {
          methods.setError(name, { type, message });
        });
      }
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('user.successCreateMessage'),
        icon: <IconCheck />,
      });
      router.push('/setting/user');
      methods.reset();
    },
  });

  const roleCallback = React.useCallback((value: IManagementRolesData) => {
    const data: RadioProps = {
      value: value.id,
      label: value.name,
      size: 'sm',
    };
    return data;
  }, []);

  const roleItem = rolesData?.map(roleCallback);

  const userField = React.useMemo(() => {
    const field: ControllerGroup[] = [
      {
        group: 'Akun',
        formControllers: [
          name,
          username,
          email,
          phoneNumber,
          password,
          confirmPassword,
          {
            control: 'image-dropzone',
            name: 'photo',
            label: 'photo',
            maxSize: 10 * 1024 ** 2 /* 10MB */,
            multiple: false,
            onDrop: (value) => {
              methods.setValue('photo', value);
              methods.clearErrors('photo');
            },
            onReject: (files) =>
              handleRejectFile<ICreateUserValues>({
                methods,
                files,
                field: 'photo',
              }),
          },
        ],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitForm: SubmitHandler<ICreateUserValues> = (data) => {
    const {
      name,
      email,
      username,
      password,
      confirmPassword,
      phoneNumber,
      photo,
      roleId,
    } = data;
    mutate({
      name,
      email,
      username,
      password,
      confirmPassword,
      phoneNumber,
      photo,
      roleId,
    });
  };

  return (
    <DashboardCard p={0} isLoading={rolesLoading}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmitForm)}>
          <Stack spacing={32} p={32} align="flex-start">
            {userField.map(({ formControllers, group }, i) => {
              return (
                <Paper p={24} key={i} withBorder>
                  <Stack spacing={8}>
                    <Text component="span" fw={400} fz={16} mb="md">
                      {group}
                    </Text>
                    <Grid gutter="md">
                      {formControllers.map(
                        ({ colSpan = 12, name, ...rest }, index) => {
                          return (
                            <Grid.Col span={colSpan} key={index}>
                              <FormController name={name} {...rest} />
                            </Grid.Col>
                          );
                        }
                      )}
                    </Grid>
                  </Stack>
                </Paper>
              );
            })}
            <Text fz={20} fw={600}>
              {t('commonTypography.role')}
            </Text>
            <RadioInputRhf
              control="radio-input"
              name="roleId"
              radioComponentWrapper={{
                direction: 'column',
                gap: 'md',
              }}
              radioComponent={roleItem ?? []}
            />
            <Group w="100%" position="apart">
              <PrimaryButton
                label={t('commonTypography.back')}
                type="button"
                variant="outline"
                leftIcon={<IconChevronLeft size="1rem" />}
                onClick={() => router.back()}
              />
              <PrimaryButton
                label={t('commonTypography.save')}
                type="submit"
                loading={isLoading}
              />
            </Group>
          </Stack>
        </form>
      </FormProvider>
    </DashboardCard>
  );
};

export default CreateUserBook;
