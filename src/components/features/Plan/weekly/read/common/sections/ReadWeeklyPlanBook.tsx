import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalAlert,
  PlanGroupLink,
} from '@/components/elements';

import { useUpdateIsDeterminedWeeklyPlan } from '@/services/graphql/mutation/plan/weekly/useIsDeterminedWeeklyPlan';
import { useUpdateIsValidateWeeklyPlan } from '@/services/graphql/mutation/plan/weekly/useIsValidateWeeklyPlan';
import { useReadOneWeeklyPlan } from '@/services/graphql/query/plan/weekly/useReadOneWeeklyPlan';
import { statusValidationSchema } from '@/utils/form-validation/status-validation/status-mutation-validation';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

import { IUpdateStatusValues } from '@/types/global';

const ReadWeeklyPlanBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const id = router.query.id as string;

  const methods = useForm<IUpdateStatusValues>({
    resolver: zodResolver(statusValidationSchema),
    defaultValues: {
      statusMessage: '',
    },
    mode: 'onSubmit',
  });

  const { weeklyPlanData, weeklyPlanDataLoading } = useReadOneWeeklyPlan({
    variables: {
      id,
    },
    skip: !router.isReady,
  });

  const [executeUpdateStatus, { loading }] = useUpdateIsValidateWeeklyPlan({
    onCompleted: (data) => {
      const message = {
        '4d4d646d-d0e5-4f94-ba6d-171be20032fc': t(
          'weeklyPlan.successIsValidateMessage'
        ),
        'af06163a-2ba3-45ee-a724-ab3af0c97cc9': t(
          'weeklyPlan.successIsNotValidateMessage'
        ),
        default: t('weeklyPlan.title'),
      };
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: message[data.validateWeeklyPlan.status.id],
        icon: <IconCheck />,
      });
      router.push('/plan/weekly');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        notifications.show({
          color: 'red',
          title: 'Gagal',
          message: error.message,
          icon: <IconX />,
        });
      }
    },
  });

  const [executeUpdateStatusDetermiend, { loading: determinedLoading }] =
    useUpdateIsDeterminedWeeklyPlan({
      onCompleted: (data) => {
        const message = {
          'f5f644d9-8810-44f7-8d42-36b5222b97d1': t(
            'weeklyPlan.successIsDeterminedMessage'
          ),
          '7848a063-ae40-4a80-af86-dfc532cbb688': t(
            'weeklyPlan.successIsRejectMessage'
          ),
          default: t('weeklyPlan.title'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.determineWeeklyPlan.status.id],
          icon: <IconCheck />,
        });
        router.push('/plan/weekly');
      },
      onError: (error) => {
        if (error.graphQLErrors) {
          notifications.show({
            color: 'red',
            title: 'Gagal',
            message: error.message,
            icon: <IconX />,
          });
        }
      },
    });

  const handleIsValid = async () => {
    await executeUpdateStatus({
      variables: {
        id,
        status: true,
        statusMessage: null,
      },
    });
  };

  const handleInvalidForm: SubmitHandler<IUpdateStatusValues> = async (
    data
  ) => {
    await executeUpdateStatus({
      variables: {
        id,
        status: false,
        statusMessage: data.statusMessage,
      },
    });
  };

  const handleIsDetermined = async () => {
    await executeUpdateStatusDetermiend({
      variables: {
        id,
        status: true,
        statusMessage: null,
      },
    });
  };

  const handleRejectForm: SubmitHandler<IUpdateStatusValues> = async (data) => {
    await executeUpdateStatusDetermiend({
      variables: {
        id,
        status: false,
        statusMessage: data.statusMessage,
      },
    });
  };

  const includesWaiting = [`${process.env.NEXT_PUBLIC_STATUS_WAITING}`];
  const includesValid = [`${process.env.NEXT_PUBLIC_STATUS_VALID}`];

  const isPermissionValidation = permissions?.includes('validate-weekly-plan');
  const isShowButtonValidation = includesWaiting.includes(
    weeklyPlanData?.status?.id ?? ''
  );
  const isShowButtonInvalidation = includesWaiting.includes(
    weeklyPlanData?.status?.id ?? ''
  );

  const isPermissionDetermination = permissions?.includes(
    'determine-weekly-plan'
  );
  const isShowButtonDetermined = includesValid.includes(
    weeklyPlanData?.status?.id ?? ''
  );
  const isShowButtonReject = includesValid.includes(
    weeklyPlanData?.status?.id ?? ''
  );

  return (
    <DashboardCard
      p={0}
      isLoading={weeklyPlanDataLoading}
      validationButton={
        isPermissionValidation && isShowButtonValidation
          ? {
              onClickValid: handleIsValid,
              loading: loading,
            }
          : undefined
      }
      determinedButton={
        isPermissionDetermination && isShowButtonDetermined
          ? {
              onClickDetermined: handleIsDetermined,
              loading: determinedLoading,
            }
          : undefined
      }
      notValidButton={
        isPermissionValidation && isShowButtonInvalidation
          ? {
              methods: methods,
              submitForm: handleInvalidForm,
              textAreaName: 'statusMessage',
              textAreaLabel: 'invalidReason',
              loading: loading,
            }
          : undefined
      }
      rejectButton={
        isPermissionDetermination && isShowButtonReject
          ? {
              methods: methods,
              submitForm: handleRejectForm,
              textAreaName: 'statusMessage',
              textAreaLabel: 'rejectReason',
              loading: determinedLoading,
            }
          : undefined
      }
      enebleBackBottomOuter={{
        onClick: () => router.push('/plan/weekly'),
      }}
    >
      {weeklyPlanData?.status?.id === 'af06163a-2ba3-45ee-a724-ab3af0c97cc9' ? (
        <GlobalAlert
          description={weeklyPlanData?.statusMessage ?? ''}
          title={t('commonTypography.invalidData')}
          color="red"
          mt="xs"
        />
      ) : null}
      {weeklyPlanData?.status?.id === '7848a063-ae40-4a80-af86-dfc532cbb688' ? (
        <GlobalAlert
          description={weeklyPlanData?.statusMessage ?? ''}
          title={t('commonTypography.rejectedData')}
          color="red"
          mt="xs"
        />
      ) : null}
      <PlanGroupLink type="read" planType="weekly" />
    </DashboardCard>
  );
};

export default ReadWeeklyPlanBook;
