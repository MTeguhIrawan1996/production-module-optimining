import { zodResolver } from '@hookform/resolvers/zod';
import { Divider, Stack, Tabs, Text } from '@mantine/core';
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
  GlobalHeaderDetail,
  KeyValueList,
} from '@/components/elements';
import { IKeyValueItemProps } from '@/components/elements/global/KeyValueList';

import { useUpdateIsDeterminedShippingMonitoring } from '@/services/graphql/mutation/shipping-monitoring/useIsDeterminedShippingMonitoring';
import { useUpdateIsValidateShippingMonitoring } from '@/services/graphql/mutation/shipping-monitoring/useIsValidateShippingMonitoring';
import { useReadOneShippingMonitoring } from '@/services/graphql/query/shipping-monitoring/useReadOneShippingMonitoring';
import { statusValidationSchema } from '@/utils/form-validation/status-validation/status-mutation-validation';
import { formatDate } from '@/utils/helper/dateFormat';

import { IUpdateStatusValues } from '@/types/global';

const ReadShippingMonitoringBook = () => {
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

  /* #   /**=========== Query =========== */
  const {
    monitoringBarging,
    monitoringBargingGrouping,
    monitoringBargingLoading,
  } = useReadOneShippingMonitoring({
    variables: {
      id,
    },
    skip: !router.isReady,
  });

  const [executeUpdateStatus, { loading }] =
    useUpdateIsValidateShippingMonitoring({
      onCompleted: (data) => {
        const message = {
          '4d4d646d-d0e5-4f94-ba6d-171be20032fc': t(
            'shippingMonitoring.successIsValidateMessage'
          ),
          'af06163a-2ba3-45ee-a724-ab3af0c97cc9': t(
            'shippingMonitoring.successIsNotValidateMessage'
          ),
          default: t('commonTypography.shippingMonitoring'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.validateMonitoringBarging.status.id],
          icon: <IconCheck />,
        });
        router.push(
          '/input-data/quality-control-management/shipping-monitoring'
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
    useUpdateIsDeterminedShippingMonitoring({
      onCompleted: (data) => {
        const message = {
          'f5f644d9-8810-44f7-8d42-36b5222b97d1': t(
            'shippingMonitoring.successIsDeterminedMessage'
          ),
          '7848a063-ae40-4a80-af86-dfc532cbb688': t(
            'shippingMonitoring.successIsRejectMessage'
          ),
          default: t('commonTypography.shippingMonitoring'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.determineMonitoringBarging.status.id],
          icon: <IconCheck />,
        });
        router.push(
          '/input-data/quality-control-management/shipping-monitoring'
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

  const photo = monitoringBarging?.photo
    ? [
        {
          type: 'photo',
          alt: monitoringBarging?.photo?.fileName,
          fileName: monitoringBarging?.photo?.originalFileName,
          src: monitoringBarging?.photo?.url,
        },
      ]
    : [];

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

  const isShowButtonValidation = includesWaiting.includes(
    monitoringBarging?.status?.id ?? ''
  );

  const isShowButtonInvalidation = includesWaiting.includes(
    monitoringBarging?.status?.id ?? ''
  );

  const isShowButtonDetermined = includesValid.includes(
    monitoringBarging?.status?.id ?? ''
  );

  const isShowButtonReject = includesValid.includes(
    monitoringBarging?.status?.id ?? ''
  );
  const isHiddenButtonEdit = includesDetermined.includes(
    monitoringBarging?.status?.id ?? ''
  );

  return (
    <DashboardCard
      title={t('shippingMonitoring.readShippingMonitoring')}
      updateButton={
        isHiddenButtonEdit
          ? undefined
          : {
              label: 'Edit',
              onClick: () =>
                router.push(
                  `/input-data/quality-control-management/shipping-monitoring/update/${id}`
                ),
            }
      }
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
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      enebleBackBottomOuter={{
        onClick: () =>
          router.push(
            '/input-data/quality-control-management/shipping-monitoring'
          ),
      }}
      shadow="xs"
      isLoading={monitoringBargingLoading}
      paperStackProps={{
        spacing: 'sm',
      }}
    >
      <Tabs
        defaultValue="information"
        radius={4}
        styles={{
          tabsList: {
            flexWrap: 'nowrap',
          },
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="information" fz={14} fw={500}>
            {t('commonTypography.information')}
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="information">
          {monitoringBarging?.status?.id ===
          'af06163a-2ba3-45ee-a724-ab3af0c97cc9' ? (
            <GlobalAlert
              description={monitoringBarging?.statusMessage ?? ''}
              title={t('commonTypography.invalidData')}
              color="red"
              mt="xs"
            />
          ) : null}
          {monitoringBarging?.status?.id ===
          '7848a063-ae40-4a80-af86-dfc532cbb688' ? (
            <GlobalAlert
              description={monitoringBarging?.statusMessage ?? ''}
              title={t('commonTypography.rejectedData')}
              color="red"
              mt="xs"
            />
          ) : null}
          <Stack spacing="sm" mt="sm">
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.date'),
                  value: formatDate(monitoringBarging?.createdAt) ?? '-',
                },
              ]}
              type="grid"
            />
          </Stack>
          {!monitoringBargingLoading && monitoringBarging ? (
            <>
              <GlobalHeaderDetail
                data={[...photo]}
                title="documentation"
                pt="md"
              />
              <Divider my="md" />
            </>
          ) : null}
          {monitoringBargingGrouping.map((val, i) => {
            const keyValueData: Pick<
              IKeyValueItemProps,
              'value' | 'dataKey'
            >[] = val.itemValue.map((obj) => {
              return {
                dataKey: t(`commonTypography.${obj.name}`),
                value: obj.value,
              };
            });
            return (
              <React.Fragment key={i}>
                <Stack spacing="sm">
                  {val.enableTitle && (
                    <Text fz={24} fw={600} color="brand">
                      {t(`commonTypography.${val.group}`)}
                    </Text>
                  )}
                  <KeyValueList data={keyValueData} type="grid" />
                </Stack>
                {val.withDivider && <Divider my="md" />}
              </React.Fragment>
            );
          })}
        </Tabs.Panel>
      </Tabs>
    </DashboardCard>
  );
};

export default ReadShippingMonitoringBook;
