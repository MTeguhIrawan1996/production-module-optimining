import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationActivityPlanValues,
  useUpdateActivityPlanMaster,
} from '@/services/graphql/mutation/activity-plan/useUpdateActivityPlanMaster';
import { useReadOneActivityPlanMaster } from '@/services/graphql/query/activity-plan/useReadOneActivityPlanMaster';
import { globalText } from '@/utils/constants/Field/global-field';
import { activityPlanMutationValidation } from '@/utils/form-validation/activity-plan/activity-plan-mutation-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const UpdateActivityPlanBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const methods = useForm<IMutationActivityPlanValues>({
    resolver: zodResolver(activityPlanMutationValidation),
    defaultValues: {
      name: '',
    },
    mode: 'onBlur',
  });

  const { activityPlanMasterLoading } = useReadOneActivityPlanMaster({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: (data) => {
      methods.setValue('name', data.activityPlan.name);
    },
  });

  const [executeUpdate, { loading }] = useUpdateActivityPlanMaster({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('activityPlan.successUpdateMessage'),
        icon: <IconCheck />,
      });
      router.push('/master-data/activity-plan');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<IMutationActivityPlanValues>(error);
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

  const fieldItem = React.useMemo(() => {
    const activityPlanItem = globalText({
      name: 'name',
      label: 'activityPlan',
      colSpan: 12,
      withAsterisk: true,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.activityPlan'),
        formControllers: [activityPlanItem],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitForm: SubmitHandler<IMutationActivityPlanValues> = async (
    data
  ) => {
    const { name } = data;
    await executeUpdate({
      variables: {
        id,
        name,
      },
    });
  };
  return (
    <DashboardCard p={0} isLoading={activityPlanMasterLoading}>
      <GlobalFormGroup
        field={fieldItem}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        backButton={{
          onClick: () => router.back(),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateActivityPlanBook;
