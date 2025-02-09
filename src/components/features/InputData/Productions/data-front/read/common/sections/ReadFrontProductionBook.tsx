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
  MantineDataTable,
} from '@/components/elements';
import { IKeyValueItemProps } from '@/components/elements/global/KeyValueList';

import { useUpdateIsDeterminedFrontProduction } from '@/services/graphql/mutation/front-production/useIsDeterminedFrontProduction';
import { useUpdateIsValidateFrontProduction } from '@/services/graphql/mutation/front-production/useIsValidateFrontProduction';
import { useReadOneFrontProduction } from '@/services/graphql/query/front-production/useReadOneFrontProduction';
import { statusValidationSchema } from '@/utils/form-validation/status-validation/status-mutation-validation';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

import { IUpdateStatusValues } from '@/types/global';

const ReadFrontProductionBook = () => {
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
  const { frontData, frontDataGrouping, frontDataLoading } =
    useReadOneFrontProduction({
      variables: {
        id,
      },
      skip: !router.isReady,
    });

  const [executeUpdateStatus, { loading }] = useUpdateIsValidateFrontProduction(
    {
      onCompleted: (data) => {
        const message = {
          '4d4d646d-d0e5-4f94-ba6d-171be20032fc': t(
            'frontProduction.successIsValidateMessage'
          ),
          'af06163a-2ba3-45ee-a724-ab3af0c97cc9': t(
            'frontProduction.successIsNotValidateMessage'
          ),
          default: t('commonTypography.front'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.validateFrontData.status.id],
          icon: <IconCheck />,
        });
        router.push(
          `/input-data/production/data-front?page=1&segment=${frontData?.type}`
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
    }
  );

  const [executeUpdateStatusDetermiend, { loading: determinedLoading }] =
    useUpdateIsDeterminedFrontProduction({
      onCompleted: (data) => {
        const message = {
          'f5f644d9-8810-44f7-8d42-36b5222b97d1': t(
            'frontProduction.successIsDeterminedMessage'
          ),
          '7848a063-ae40-4a80-af86-dfc532cbb688': t(
            'frontProduction.successIsRejectMessage'
          ),
          default: t('commonTypography.front'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.determineFrontData.status.id],
          icon: <IconCheck />,
        });
        router.push(
          `/input-data/production/data-front?page=1&segment=${frontData?.type}`
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

  const isPermissionValidation = permissions?.includes('validate-front-data');
  const isShowButtonValidation = includesWaiting.includes(
    frontData?.status?.id ?? ''
  );
  const isShowButtonInvalidation = includesWaiting.includes(
    frontData?.status?.id ?? ''
  );

  const isPermissionDetermination = permissions?.includes(
    'determine-front-data'
  );
  const isShowButtonDetermined = includesValid.includes(
    frontData?.status?.id ?? ''
  );
  const isShowButtonReject = includesValid.includes(
    frontData?.status?.id ?? ''
  );

  const isPermissionEdit = permissions?.includes('update-front-data');
  const isIncludeDetermination = includesDetermined.includes(
    frontData?.status?.id ?? ''
  );

  return (
    <DashboardCard
      title={t('frontProduction.readFrontProduction')}
      updateButton={
        isPermissionEdit && !isIncludeDetermination
          ? {
              label: 'Edit',
              onClick: () =>
                router.push(
                  `/input-data/production/data-front/update/${id}?segment=${frontData?.type}`
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
            `/input-data/production/data-front?page=1&segment=${frontData?.type}`
          ),
      }}
      shadow="xs"
      isLoading={frontDataLoading}
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
          {frontData?.status?.id === 'af06163a-2ba3-45ee-a724-ab3af0c97cc9' ? (
            <GlobalAlert
              description={frontData?.statusMessage ?? ''}
              title={t('commonTypography.invalidData')}
              color="red"
              mt="xs"
            />
          ) : null}
          {frontData?.status?.id === '7848a063-ae40-4a80-af86-dfc532cbb688' ? (
            <GlobalAlert
              description={frontData?.statusMessage ?? ''}
              title={t('commonTypography.rejectedData')}
              color="red"
              mt="xs"
            />
          ) : null}
          {frontDataGrouping.map((val, i) => {
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
                <Stack
                  spacing="sm"
                  mt={i === 0 ? 'sm' : undefined}
                  mb={i === 0 ? 'sm' : undefined}
                >
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
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.supportingHeavyEquipment')}
            </Text>
            <MantineDataTable
              tableProps={{
                records: frontData?.supportingHeavyEquipments ?? [],
                columns: [
                  {
                    accessor: 'activity',
                    title: t('commonTypography.activity'),
                    noWrap: false,
                    render: ({ activityPlan }) => activityPlan?.name || '-',
                  },
                  {
                    accessor: 'heavyEquipmentCode',
                    title: t('commonTypography.heavyEquipmentCode'),
                    render: ({ companyHeavyEquipment }) =>
                      companyHeavyEquipment?.hullNumber || '-',
                  },
                ],
                shadow: 'none',
              }}
              emptyStateProps={{
                title: t('commonTypography.dataNotfound'),
              }}
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </DashboardCard>
  );
};

export default ReadFrontProductionBook;
