import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Divider, ScrollArea, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalAlert,
  GlobalHeaderDetail,
  GlobalTabs,
  KeyValueList,
  MantineDataTable,
} from '@/components/elements';
import { IKeyValueItemProps } from '@/components/elements/global/KeyValueList';

import { useUpdateIsDeterminedShippingMonitoring } from '@/services/graphql/mutation/shipping-monitoring/useIsDeterminedShippingMonitoring';
import { useUpdateIsValidateShippingMonitoring } from '@/services/graphql/mutation/shipping-monitoring/useIsValidateShippingMonitoring';
import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import {
  IDomesShipping,
  useReadOneShippingMonitoring,
} from '@/services/graphql/query/shipping-monitoring/useReadOneShippingMonitoring';
import { statusValidationSchema } from '@/utils/form-validation/status-validation/status-mutation-validation';
import { formatDate } from '@/utils/helper/dateFormat';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

import { IUpdateStatusValues } from '@/types/global';

const ReadShippingMonitoringBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const id = router.query.id as string;
  const [otherElements, setOtherElements] = React.useState<
    DataTableColumn<IDomesShipping>[]
  >([]);

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

  useReadAllElementMaster({
    variables: {
      limit: null,
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: ({ elements }) => {
      const value = elements.data.map((element) => {
        const column: DataTableColumn<IDomesShipping> = {
          accessor: element.name,
          title: element.name,
          render: ({ monitoringStockpile }) => {
            const output =
              monitoringStockpile.ritageSamples.additional.averageSamples?.find(
                (val) => val.id === element.id
              );
            return output?.value || '-';
          },
        };
        return column;
      });
      setOtherElements(value);
    },
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

  const isPermissionValidation = permissions?.includes(
    'validate-monitoring-barging'
  );
  const isShowButtonValidation = includesWaiting.includes(
    monitoringBarging?.status?.id ?? ''
  );
  const isShowButtonInvalidation = includesWaiting.includes(
    monitoringBarging?.status?.id ?? ''
  );

  const isPermissionDetermination = permissions?.includes(
    'determine-monitoring-barging'
  );
  const isShowButtonDetermined = includesValid.includes(
    monitoringBarging?.status?.id ?? ''
  );
  const isShowButtonReject = includesValid.includes(
    monitoringBarging?.status?.id ?? ''
  );

  const isPermissionEdit = permissions?.includes('update-monitoring-barging');
  const isIncludeDetermination = includesDetermined.includes(
    monitoringBarging?.status?.id ?? ''
  );

  return (
    <DashboardCard
      title={t('shippingMonitoring.readShippingMonitoring')}
      updateButton={
        isPermissionEdit && !isIncludeDetermination
          ? {
              label: 'Edit',
              onClick: () =>
                router.push(
                  `/input-data/quality-control-management/shipping-monitoring/update/${id}`
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
            '/input-data/quality-control-management/shipping-monitoring'
          ),
      }}
      shadow="xs"
      isLoading={monitoringBargingLoading}
      paperStackProps={{
        spacing: 'sm',
      }}
    >
      <GlobalTabs
        tabs={{
          keepMounted: false,
          defaultValue: 'information',
        }}
        tabsData={[
          {
            label: t('commonTypography.information'),
            value: 'information',
            component: (
              <>
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
                {!monitoringBargingLoading && monitoringBarging ? (
                  <>
                    <GlobalHeaderDetail
                      data={[...photo]}
                      title="documentation"
                      pt="xs"
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
                <Stack spacing="sm" sx={{ height: 'fit-content' }}>
                  <Text fz={24} fw={600} color="brand">
                    {t('commonTypography.listDome')} yang dibarging
                  </Text>
                  <ScrollArea.Autosize
                    mah={540}
                    offsetScrollbars
                    type="always"
                    sx={{
                      zIndex: 1,
                    }}
                  >
                    <Box sx={{ height: 'fit-content' }}>
                      <MantineDataTable
                        tableProps={{
                          records: monitoringBarging?.domes ?? [],
                          columns: [
                            {
                              accessor: 'name',
                              title: t('commonTypography.domeName'),
                              textAlignment: 'left',
                            },
                            {
                              accessor: 'totalRitages',
                              title: 'Total Ritase Barging',
                              textAlignment: 'left',
                            },
                            {
                              accessor: 'tonRitages',
                              title: 'Ton Ritase Barging',
                              textAlignment: 'left',
                            },
                            ...(otherElements ?? []),
                          ],
                          shadow: 'none',
                        }}
                        emptyStateProps={{
                          title: t('commonTypography.dataNotfound'),
                        }}
                      />
                    </Box>
                  </ScrollArea.Autosize>
                </Stack>
                <Divider my="md" />
                <Stack spacing="sm" sx={{ height: 'fit-content' }}>
                  <Text fz={24} fw={600} color="brand">
                    {t('commonTypography.listRitageBarging')}
                  </Text>
                  <ScrollArea.Autosize
                    mah={540}
                    offsetScrollbars
                    type="always"
                    sx={{
                      zIndex: 1,
                    }}
                  >
                    <Box sx={{ height: 'fit-content' }}>
                      <MantineDataTable
                        tableProps={{
                          records: monitoringBarging?.bargingRitages ?? [],
                          columns: [
                            {
                              accessor: 'heavyEquipmentCode',
                              title: t('commonTypography.heavyEquipmentCode'),
                              textAlignment: 'left',
                              render: ({ companyHeavyEquipment }) =>
                                companyHeavyEquipment.hullNumber || '-',
                            },
                            {
                              accessor: 'date',
                              title: t('commonTypography.date'),
                              textAlignment: 'left',
                              render: ({ date }) => formatDate(date) || '-',
                            },
                            {
                              accessor: 'shift',
                              title: t('commonTypography.shift'),
                              textAlignment: 'left',
                              render: ({ shift }) => shift.name || '-',
                            },
                            {
                              accessor: 'ton',
                              title: 'Ton',
                              textAlignment: 'left',
                              render: ({ tonByRitage }) => tonByRitage || '-',
                            },
                          ],
                          shadow: 'none',
                        }}
                        emptyStateProps={{
                          title: t('commonTypography.dataNotfound'),
                        }}
                      />
                    </Box>
                  </ScrollArea.Autosize>
                </Stack>
              </>
            ),
            isShowItem: true,
          },
        ]}
      />
    </DashboardCard>
  );
};

export default ReadShippingMonitoringBook;
