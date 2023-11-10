import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, Group, Paper, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { IconChevronLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  CheckboxGroupRoleAccess,
  DashboardCard,
  FormController,
  PrimaryButton,
} from '@/components/elements';

import {
  IUpdateRoleRequest,
  useUpdateRole,
} from '@/services/graphql/mutation/management-role/useUpdateRole';
import { useReadOneRole } from '@/services/graphql/query/management-role/useReadOneManagementRole';
import { useReadAllModule } from '@/services/graphql/query/module/useReadAllModule';
import { description } from '@/utils/constants/Field/global-field';
import { createRoleValidationSchema } from '@/utils/form-validation/management-role/management-role-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const UpdateManagementRoleBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const methods = useForm<Omit<IUpdateRoleRequest, 'id'>>({
    resolver: zodResolver(createRoleValidationSchema),
    defaultValues: {
      name: '',
      desc: '',
      permissionIds: [],
    },
    mode: 'onSubmit',
  });

  const { moduleData } = useReadAllModule({
    variables: {
      limit: null,
    },
  });

  const { roleDataLoading } = useReadOneRole({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: (data) => {
      const allCheckboxValues: string[] = [];
      data.role.modules.data.forEach((moduleData) => {
        moduleData.permissions.data.forEach((checkbox) => {
          allCheckboxValues.push(checkbox.id);
        });
      });
      methods.setValue('name', data.role.name);
      methods.setValue('desc', data.role.desc ?? '');
      methods.setValue('permissionIds', allCheckboxValues);
    },
  });

  const [executeUpdate, { loading }] = useUpdateRole({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('managementRole.successUpdateMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push('/setting/management-role');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<Omit<IUpdateRoleRequest, 'id'>>(error);
        if (errorArry.length) {
          errorArry.forEach(({ name, type, message }) => {
            methods.setError(name, { type, message });
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

  const managementRoleField: ControllerGroup[] = [
    {
      group: 'Role Name',
      formControllers: [
        {
          control: 'text-input',
          name: 'name',
          label: 'roleName',
          withAsterisk: true,
        },
      ],
    },
    {
      group: 'Description',
      formControllers: [description],
    },
  ];

  const handleCheckedAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;
    if (isChecked) {
      const allCheckboxValues: string[] = [];
      moduleData?.forEach((setting) => {
        setting.permissions.data.forEach((checkbox) => {
          allCheckboxValues.push(checkbox.id);
        });
      });
      methods.setValue('permissionIds', allCheckboxValues);
      return;
    }
    methods.setValue('permissionIds', []);
  };

  const handleSubmitForm: SubmitHandler<
    Omit<IUpdateRoleRequest, 'id'>
  > = async (data) => {
    const { name, desc, permissionIds } = data;
    await executeUpdate({
      variables: {
        id,
        name,
        desc,
        permissionIds,
      },
    });
  };

  return (
    <DashboardCard p={0} isLoading={roleDataLoading}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmitForm)}>
          <Stack spacing={32} p={32}>
            {managementRoleField.map(({ formControllers }, i) => {
              return (
                <Paper p={24} key={i} withBorder>
                  <Stack spacing={8}>
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
            <CheckboxGroupRoleAccess
              name="permissionIds"
              dataComponents={moduleData}
              handleCheckedAll={handleCheckedAll}
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
                loading={loading}
              />
            </Group>
          </Stack>
        </form>
      </FormProvider>
    </DashboardCard>
  );
};

export default UpdateManagementRoleBook;
