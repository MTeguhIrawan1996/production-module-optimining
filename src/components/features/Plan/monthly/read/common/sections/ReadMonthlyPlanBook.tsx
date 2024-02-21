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

import { useUpdateIsDeterminedMonthlyPlan } from '@/services/graphql/mutation/plan/monthly/useIsDeterminedMonthlyPlan';
import { useUpdateIsValidateMonthlyPlan } from '@/services/graphql/mutation/plan/monthly/useIsValidateMonthlyPlan';
import { useReadOneMonthlyPlan } from '@/services/graphql/query/plan/monthly/useReadOneMonthlyPlan';
import { statusValidationSchema } from '@/utils/form-validation/status-validation/status-mutation-validation';

import { IUpdateStatusValues } from '@/types/global';

const ReadMonthlyPlanBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

  const methods = useForm<IUpdateStatusValues>({
    resolver: zodResolver(statusValidationSchema),
    defaultValues: {
      statusMessage: '',
    },
    mode: 'onSubmit',
  });

  const { monthlyPlanData, monthlyPlanDataLoading } = useReadOneMonthlyPlan({
    variables: {
      id,
    },
    skip: !router.isReady,
  });

  const [executeUpdateStatus, { loading }] = useUpdateIsValidateMonthlyPlan({
    onCompleted: (data) => {
      const message = {
        '4d4d646d-d0e5-4f94-ba6d-171be20032fc': t(
          'monthlyPlan.successIsValidateMessage'
        ),
        'af06163a-2ba3-45ee-a724-ab3af0c97cc9': t(
          'monthlyPlan.successIsNotValidateMessage'
        ),
        default: t('monthlyPlan.title'),
      };
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: message[data.validateMonthlyPlan.status.id],
        icon: <IconCheck />,
      });
      router.push('/plan/monthly');
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
    useUpdateIsDeterminedMonthlyPlan({
      onCompleted: (data) => {
        const message = {
          'f5f644d9-8810-44f7-8d42-36b5222b97d1': t(
            'monthlyPlan.successIsDeterminedMessage'
          ),
          '7848a063-ae40-4a80-af86-dfc532cbb688': t(
            'monthlyPlan.successIsRejectMessage'
          ),
          default: t('monthlyPlan.title'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.determineMonthlyPlan.status.id],
          icon: <IconCheck />,
        });
        router.push('/plan/monthly');
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

  const isShowButtonValidation = includesWaiting.includes(
    monthlyPlanData?.status?.id ?? ''
  );

  const isShowButtonInvalidation = includesWaiting.includes(
    monthlyPlanData?.status?.id ?? ''
  );

  const isShowButtonDetermined = includesValid.includes(
    monthlyPlanData?.status?.id ?? ''
  );

  const isShowButtonReject = includesValid.includes(
    monthlyPlanData?.status?.id ?? ''
  );

  return (
    <DashboardCard
      p={0}
      isLoading={monthlyPlanDataLoading}
      validationButton={
        isShowButtonValidation
          ? {
              onClickValid: handleIsValid,
              loading: loading,
            }
          : undefined
      }
      determinedButton={
        isShowButtonDetermined
          ? {
              onClickDetermined: handleIsDetermined,
              loading: determinedLoading,
            }
          : undefined
      }
      notValidButton={
        isShowButtonInvalidation
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
        isShowButtonReject
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
        onClick: () => router.push('/plan/monthly'),
      }}
    >
      {monthlyPlanData?.status?.id ===
      'af06163a-2ba3-45ee-a724-ab3af0c97cc9' ? (
        <GlobalAlert
          description={monthlyPlanData?.statusMessage ?? ''}
          title={t('commonTypography.invalidData')}
          color="red"
          mt="xs"
        />
      ) : null}
      {monthlyPlanData?.status?.id ===
      '7848a063-ae40-4a80-af86-dfc532cbb688' ? (
        <GlobalAlert
          description={monthlyPlanData?.statusMessage ?? ''}
          title={t('commonTypography.rejectedData')}
          color="red"
          mt="xs"
        />
      ) : null}
      <PlanGroupLink type="read" planType="monthly" />
    </DashboardCard>
  );
};

export default ReadMonthlyPlanBook;
