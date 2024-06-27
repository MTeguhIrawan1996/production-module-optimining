import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalTabs } from '@/components/elements';
import DetailSampleData from '@/components/features/InputData/QualityControlManagement/stockpile/read/common/ui/DetailSampleData';
import DetailStockpileData from '@/components/features/InputData/QualityControlManagement/stockpile/read/common/ui/DetailStockpileData';

import { useUpdateIsDeterminedStockpileMonitoring } from '@/services/graphql/mutation/stockpile-monitoring/useIsDeterminedStockpileMonitoring';
import { useUpdateIsValidateStockpileMonitoring } from '@/services/graphql/mutation/stockpile-monitoring/useIsValidateStockpileMonitoring';
import { useReadOneStockpileMonitoringDetail } from '@/services/graphql/query/stockpile-monitoring/useReadOneStockpileMonitoringDetail';
import { statusValidationSchema } from '@/utils/form-validation/status-validation/status-mutation-validation';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

import { IUpdateStatusValues } from '@/types/global';

const ReadStockpileMonitoringBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const id = router.query.id as string;

  const methods = useForm<IUpdateStatusValues>({
    resolver: zodResolver(statusValidationSchema),
    defaultValues: {
      statusMessage: '',
    },
    mode: 'onSubmit',
  });

  /* #   /**=========== Query =========== */
  const { monitoringStockpileDetail, monitoringStockpileDetailLoading } =
    useReadOneStockpileMonitoringDetail({
      variables: {
        id,
      },
      skip: !router.isReady,
    });

  const [executeUpdateStatus, { loading }] =
    useUpdateIsValidateStockpileMonitoring({
      onCompleted: (data) => {
        const message = {
          '4d4d646d-d0e5-4f94-ba6d-171be20032fc': t(
            'stockpileMonitoring.successIsValidateMessage'
          ),
          'af06163a-2ba3-45ee-a724-ab3af0c97cc9': t(
            'stockpileMonitoring.successIsNotValidateMessage'
          ),
          default: t('commonTypography.stockpileData'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.validateMonitoringStockpile.status.id],
          icon: <IconCheck />,
        });
        router.push(
          '/input-data/quality-control-management/stockpile-monitoring'
        );
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
    useUpdateIsDeterminedStockpileMonitoring({
      onCompleted: (data) => {
        const message = {
          'f5f644d9-8810-44f7-8d42-36b5222b97d1': t(
            'stockpileMonitoring.successIsDeterminedMessage'
          ),
          '7848a063-ae40-4a80-af86-dfc532cbb688': t(
            'stockpileMonitoring.successIsRejectMessage'
          ),
          default: t('commonTypography.stockpileData'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.determineMonitoringStockpile.status.id],
          icon: <IconCheck />,
        });
        router.push(
          '/input-data/quality-control-management/stockpile-monitoring'
        );
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
  /* #endregion  /**======== Query =========== */

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
  const includesDetermined = [`${process.env.NEXT_PUBLIC_STATUS_DETERMINED}`];

  const isPermissionValidation = permissions?.includes(
    'validate-monitoring-stockpile'
  );
  const isShowButtonValidation = includesWaiting.includes(
    monitoringStockpileDetail?.status?.id ?? ''
  );
  const isShowButtonInvalidation = includesWaiting.includes(
    monitoringStockpileDetail?.status?.id ?? ''
  );

  const isPermissionDetermination = permissions?.includes(
    'determine-monitoring-stockpile'
  );
  const isShowButtonDetermined = includesValid.includes(
    monitoringStockpileDetail?.status?.id ?? ''
  );
  const isShowButtonReject = includesValid.includes(
    monitoringStockpileDetail?.status?.id ?? ''
  );

  const isPermissionEdit = permissions?.includes('update-monitoring-stockpile');
  const isIncludeDetermination = includesDetermined.includes(
    monitoringStockpileDetail?.status?.id ?? ''
  );

  return (
    <DashboardCard
      title={t('stockpileMonitoring.readStockpileMonitoring')}
      updateButton={
        isPermissionEdit && !isIncludeDetermination
          ? {
              label: 'Edit',
              onClick: () =>
                router.push(
                  `/input-data/quality-control-management/stockpile-monitoring/update/${id}`
                ),
            }
          : undefined
      }
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
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      enebleBackBottomOuter={{
        onClick: () =>
          router.push(
            '/input-data/quality-control-management/stockpile-monitoring'
          ),
      }}
      shadow="xs"
      isLoading={monitoringStockpileDetailLoading}
      paperStackProps={{
        spacing: 'sm',
      }}
    >
      <GlobalTabs
        tabs={{
          keepMounted: false,
          defaultValue: 'stockpileData',
        }}
        tabsData={[
          {
            label: 'Data Stockpile',
            value: 'stockpileData',
            component: (
              <DetailStockpileData
                monitoringStockpile={monitoringStockpileDetail}
                monitoringStockpileLoading={monitoringStockpileDetailLoading}
              />
            ),
            isShowItem: true,
          },
          {
            label: 'Data Sampel',
            value: 'sampleData',
            component: <DetailSampleData />,
            isShowItem: true,
          },
        ]}
      />
    </DashboardCard>
  );
};

export default ReadStockpileMonitoringBook;
