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
  KeyValueList,
} from '@/components/elements';
import { IKeyValueItemProps } from '@/components/elements/global/KeyValueList';

import { useDeterminedHeavyEquipmentProduction } from '@/services/graphql/mutation/heavy-equipment-production/useDeterminedHeavyEquipmentProduction';
import { useValidateHeavyEquipmentProduction } from '@/services/graphql/mutation/heavy-equipment-production/useValidateHeavyEquipmentProduction';
import {
  IProductiveIndicator,
  useReadOneHeavyEquipmentProduction,
} from '@/services/graphql/query/heavy-equipment-production/useReadOneHeavyEquipmentProduction';
import { statusValidationSchema } from '@/utils/form-validation/status-validation/status-mutation-validation';
import { formatDate, secondsDuration } from '@/utils/helper/dateFormat';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

import { IUpdateStatusValues } from '@/types/global';

const ReadHeavyEquipmentProductionBook = () => {
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

  /* #   /**=========== Query =========== */
  const { heavyEquipmentData, heavyEquipmentDataLoading } =
    useReadOneHeavyEquipmentProduction({
      variables: {
        id,
      },
      skip: !router.isReady,
    });

  const [executeUpdateStatus, { loading }] =
    useValidateHeavyEquipmentProduction({
      onCompleted: (data) => {
        const message = {
          '4d4d646d-d0e5-4f94-ba6d-171be20032fc': t(
            'heavyEquipmentProd.successIsValidateMessage'
          ),
          'af06163a-2ba3-45ee-a724-ab3af0c97cc9': t(
            'heavyEquipmentProd.successIsNotValidateMessage'
          ),
          default: t('commonTypography.heavyEquipment'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.validateHeavyEquipmentData.status.id],
          icon: <IconCheck />,
        });
        router.push('/input-data/production/data-heavy-equipment');
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
    useDeterminedHeavyEquipmentProduction({
      onCompleted: (data) => {
        const message = {
          'f5f644d9-8810-44f7-8d42-36b5222b97d1': t(
            'heavyEquipmentProd.successIsDeterminedMessage'
          ),
          '7848a063-ae40-4a80-af86-dfc532cbb688': t(
            'heavyEquipmentProd.successIsRejectMessage'
          ),
          default: t('commonTypography.heavyEquipment'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.determineHeavyEquipmentData.status.id],
          icon: <IconCheck />,
        });
        router.push('/input-data/production/data-heavy-equipment');
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
    'validate-heavy-equipment-data'
  );
  const isShowButtonValidation = includesWaiting.includes(
    heavyEquipmentData?.status?.id ?? ''
  );
  const isShowButtonInvalidation = includesWaiting.includes(
    heavyEquipmentData?.status?.id ?? ''
  );

  const isPermissionDetermination = permissions?.includes(
    'determine-heavy-equipment-data'
  );
  const isShowButtonDetermined = includesValid.includes(
    heavyEquipmentData?.status?.id ?? ''
  );
  const isShowButtonReject = includesValid.includes(
    heavyEquipmentData?.status?.id ?? ''
  );

  const isPermissionEdit = permissions?.includes('update-heavy-equipment-data');
  const isIncludeDetermination = includesDetermined.includes(
    heavyEquipmentData?.status?.id ?? ''
  );

  const loseTimeItem = heavyEquipmentData?.loseTimes?.map((val, i) => {
    const label = val.workingHourPlan?.activityName.replace(
      /\b(?:Jam|jam|hour|Hour)\b/g,
      ''
    );
    return (
      <React.Fragment key={`${val.id}${i}`}>
        {val.details && val.details.length ? (
          <>
            <Stack spacing="sm">
              <Text fz={24} fw={600} color="brand">
                {val.workingHourPlan?.activityName}
              </Text>
              {val.details.map((obj, index) => {
                const numberOfLabel =
                  val.details && val.details.length > 1 ? index + 1 : '';

                return (
                  <KeyValueList
                    data={[
                      {
                        dataKey: `${t(
                          'commonTypography.startHour'
                        )} ${label} ${numberOfLabel}`,
                        value: formatDate(obj.startAt, 'hh:mm:ss A') ?? '-',
                      },
                      {
                        dataKey: `${t(
                          'commonTypography.endHour'
                        )} ${label}  ${numberOfLabel}`,
                        value: formatDate(obj.finishAt, 'hh:mm:ss A') ?? '-',
                      },
                    ]}
                    type="grid"
                    key={index}
                  />
                );
              })}
              <KeyValueList
                data={[
                  {
                    dataKey: `${t('commonTypography.hourAmount')} ${label}`,
                    value: secondsDuration(val.totalDuration ?? null),
                  },
                ]}
                type="grid"
              />
            </Stack>
            <Divider my="md" />
          </>
        ) : null}
      </React.Fragment>
    );
  });

  const renderOtherHeavyEquipmentPreformanceCallback = React.useCallback(
    (obj: IProductiveIndicator) => {
      const column: Pick<IKeyValueItemProps, 'value' | 'dataKey'> = {
        dataKey: `${obj.formula.name}`,
        value: obj.value ? `${obj.value} %` : '-',
      };
      return column;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const renderOtherHeavyEquipmentPreformance =
    heavyEquipmentData?.productiveIndicators?.map(
      renderOtherHeavyEquipmentPreformanceCallback
    ) ?? [];

  return (
    <DashboardCard
      title={t('heavyEquipmentProd.readHeavyEquipmentProd')}
      updateButton={
        isPermissionEdit && !isIncludeDetermination
          ? {
              label: 'Edit',
              onClick: () =>
                router.push(
                  `/input-data/production/data-heavy-equipment/update/${id}`
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
          router.push('/input-data/production/data-heavy-equipment'),
      }}
      shadow="xs"
      isLoading={heavyEquipmentDataLoading}
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
          {heavyEquipmentData?.status?.id ===
          'af06163a-2ba3-45ee-a724-ab3af0c97cc9' ? (
            <GlobalAlert
              description={heavyEquipmentData?.statusMessage ?? ''}
              title={t('commonTypography.invalidData')}
              color="red"
              mt="xs"
            />
          ) : null}
          {heavyEquipmentData?.status?.id ===
          '7848a063-ae40-4a80-af86-dfc532cbb688' ? (
            <GlobalAlert
              description={heavyEquipmentData?.statusMessage ?? ''}
              title={t('commonTypography.rejectedData')}
              color="red"
              mt="xs"
            />
          ) : null}
          <Stack spacing="sm" mt="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.checkerInformation')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.foreman'),
                  value: heavyEquipmentData?.foreman?.humanResource?.name,
                },
                {
                  dataKey: t('commonTypography.date'),
                  value: formatDate(heavyEquipmentData?.date) ?? '-',
                },
                {
                  dataKey: t('commonTypography.heavyEquipmentCode'),
                  value: heavyEquipmentData?.companyHeavyEquipment?.hullNumber,
                },
                {
                  dataKey: t('commonTypography.heavyEquipmentType'),
                  value:
                    heavyEquipmentData?.companyHeavyEquipment?.heavyEquipment
                      ?.reference?.type?.name,
                },
                {
                  dataKey: t('commonTypography.heavyEquipmentCodeSubstitution'),
                  value:
                    heavyEquipmentData?.companyHeavyEquipmentChange?.hullNumber,
                },
                {
                  dataKey: t('commonTypography.changeTime'),
                  value:
                    formatDate(heavyEquipmentData?.changeAt, 'hh:mm:ss A') ??
                    '-',
                },
                {
                  dataKey: t('commonTypography.shift'),
                  value: heavyEquipmentData?.shift?.name,
                },
                {
                  dataKey: t('commonTypography.operator'),
                  value: heavyEquipmentData?.operator?.humanResource?.name,
                },
                {
                  dataKey: t('commonTypography.amountFuel'),
                  value: `${heavyEquipmentData?.fuel ?? '0'} Ltr`,
                },
              ]}
              type="grid"
            />
          </Stack>
          <Divider my="md" />
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.workingHour')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.workingHourStart'),
                  value:
                    formatDate(heavyEquipmentData?.workStartAt, 'hh:mm:ss A') ??
                    '-',
                },
                {
                  dataKey: t('commonTypography.workingHourFinish'),
                  value:
                    formatDate(
                      heavyEquipmentData?.workFinishAt,
                      'hh:mm:ss A'
                    ) ?? '-',
                },
                {
                  dataKey: t('commonTypography.workingHourAmount'),
                  value: secondsDuration(
                    heavyEquipmentData?.workDuration ?? null
                  ),
                },
              ]}
              type="grid"
            />
          </Stack>
          <Divider my="md" />
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.hourMeter')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.hourMeterBefore'),
                  value: `${heavyEquipmentData?.hourMeterBefore ?? '-'}`,
                },
                {
                  dataKey: t('commonTypography.hourMeterAfter'),
                  value: `${heavyEquipmentData?.hourMeterAfter ?? '-'}`,
                },
                {
                  dataKey: t('commonTypography.amountHourMeter'),
                  value: `${heavyEquipmentData?.hourMeterTotal ?? '-'}`,
                },
              ]}
              type="grid"
            />
          </Stack>
          <Divider my="md" />
          {loseTimeItem}
          <Stack spacing="sm">
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.amountEffectiveWorkingHours'),
                  value: heavyEquipmentData?.effectiveHour ?? null,
                },
              ]}
              type="grid"
            />
          </Stack>
          <Divider my="md" />
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.equipmentPerformance')}
            </Text>
            <KeyValueList
              data={[...renderOtherHeavyEquipmentPreformance]}
              type="grid"
            />
          </Stack>
          <Divider my="md" />
          <Stack spacing="sm">
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.desc'),
                  value: heavyEquipmentData?.desc || '-',
                },
              ]}
              type="grid"
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </DashboardCard>
  );
};

export default ReadHeavyEquipmentProductionBook;
