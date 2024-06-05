import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IUpdateMutationWHPValues,
  useUpdateWHPMaster,
} from '@/services/graphql/mutation/working-hours-plan/useUpdateWHPMaster';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadOneWHPMaster } from '@/services/graphql/query/working-hours-plan/useReadOneWHPMaster';
import { globalText } from '@/utils/constants/Field/global-field';
import { whpMutationUpdateValidation } from '@/utils/form-validation/working-hours-plan/whp-mutation-validation';
import { sendGAEvent } from '@/utils/helper/analytics';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const UpdateWorkingHoursPlanBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });
  const methods = useForm<IUpdateMutationWHPValues>({
    resolver: zodResolver(whpMutationUpdateValidation),
    defaultValues: {
      activityName: '',
    },
    mode: 'onBlur',
  });

  const { workingHourPlanMasterLoading } = useReadOneWHPMaster({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: (data) => {
      methods.setValue('activityName', data.workingHourPlan.activityName);
    },
  });

  const [executeUpdate, { loading }] = useUpdateWHPMaster({
    onCompleted: () => {
      sendGAEvent({
        event: 'Edit',
        params: {
          category: 'Pra Rencana',
          subSubCategory: '',
          subCategory: 'Pra Rencana - Rencana Waktu Hilang',
          account: userAuthData?.email ?? '',
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('workingHoursPlan.successUpdateMessage'),
        icon: <IconCheck />,
      });
      router.push('/master-data/working-hours-plan');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<IUpdateMutationWHPValues>(error);
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
    const activityItem = globalText({
      name: 'activityName',
      label: 'activity',
      colSpan: 12,
      withAsterisk: true,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.activity'),
        formControllers: [activityItem],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitForm: SubmitHandler<IUpdateMutationWHPValues> = async (
    data
  ) => {
    const { activityName } = data;
    await executeUpdate({
      variables: {
        id,
        activityName,
      },
    });
  };
  return (
    <DashboardCard p={0} isLoading={workingHourPlanMasterLoading}>
      <GlobalFormGroup
        field={fieldItem}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        backButton={{
          onClick: () => router.push('/master-data/working-hours-plan'),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateWorkingHoursPlanBook;
