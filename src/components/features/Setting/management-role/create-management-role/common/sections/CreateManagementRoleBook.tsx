import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Grid, Paper, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
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
  ICreateRoleRequest,
  useCreateRole,
} from '@/services/graphql/mutation/management-role/useCreateRole';
import { useReadAllModule } from '@/services/graphql/query/module/useReadAllModule';
import { description } from '@/utils/constants/Field/global-field';
import { createRoleValidationSchema } from '@/utils/form-validation/management-role/management-role-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const CreateManagementRoleBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const methods = useForm<ICreateRoleRequest>({
    resolver: zodResolver(createRoleValidationSchema),
    defaultValues: {
      name: '',
      desc: '',
      permissionIds: [],
    },
    mode: 'onBlur',
  });

  const { moduleData, moduleLoading } = useReadAllModule({
    variables: {
      limit: null,
    },
  });

  const managementRoleField = React.useMemo(() => {
    const field: ControllerGroup[] = [
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

    return field;
  }, []);

  const [executeCreate, { loading }] = useCreateRole({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('managementRole.successCreateMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push('/setting/management-role');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<ICreateRoleRequest>(error);
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

  const handleSubmitForm: SubmitHandler<ICreateRoleRequest> = async (data) => {
    const { name, desc, permissionIds } = data;
    await executeCreate({
      variables: {
        name,
        desc,
        permissionIds,
      },
    });
  };

  return (
    <DashboardCard p={0} isLoading={moduleLoading}>
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
            <Box sx={{ alignSelf: 'flex-end' }}>
              <PrimaryButton
                label={t('commonTypography.save')}
                type="submit"
                loading={loading}
              />
            </Box>
          </Stack>
        </form>
      </FormProvider>
    </DashboardCard>
  );
};

export default CreateManagementRoleBook;
