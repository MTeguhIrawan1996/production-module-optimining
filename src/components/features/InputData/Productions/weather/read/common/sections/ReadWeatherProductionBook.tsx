import { zodResolver } from '@hookform/resolvers/zod';
import { Divider, Stack, Tabs, Text, useMantineTheme } from '@mantine/core';
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

import { useUpdateIsDeterminedWeatherProduction } from '@/services/graphql/mutation/weather-production/useIsDeterminedWeatherProduction';
import { useUpdateIsValidateWeatherProduction } from '@/services/graphql/mutation/weather-production/useIsValidateWeatherProduction';
import { useReadOneWeatherProduction } from '@/services/graphql/query/weather-production/useReadOneWeatherProduction';
import { statusValidationSchema } from '@/utils/form-validation/status-validation/status-mutation-validation';
import { formatDate } from '@/utils/helper/dateFormat';

import { IUpdateStatusValues } from '@/types/global';

const ReadWeatherProductionBook = () => {
  const { t } = useTranslation('default');
  const theme = useMantineTheme();
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
  const { weatherData, weatherDataLoading } = useReadOneWeatherProduction({
    variables: {
      id,
    },
    skip: !router.isReady,
  });

  const [executeUpdateStatus, { loading }] =
    useUpdateIsValidateWeatherProduction({
      onCompleted: (data) => {
        const message = {
          '4d4d646d-d0e5-4f94-ba6d-171be20032fc': t(
            'weatherProd.successIsValidateMessage'
          ),
          'af06163a-2ba3-45ee-a724-ab3af0c97cc9': t(
            'weatherProd.successIsNotValidateMessage'
          ),
          default: t('commonTypography.dataWeatherProd'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.validateWeatherData.status.id],
          icon: <IconCheck />,
        });
        router.push('/input-data/production/weather');
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
    useUpdateIsDeterminedWeatherProduction({
      onCompleted: (data) => {
        const message = {
          'f5f644d9-8810-44f7-8d42-36b5222b97d1': t(
            'weatherProd.successIsDeterminedMessage'
          ),
          '7848a063-ae40-4a80-af86-dfc532cbb688': t(
            'weatherProd.successIsRejectMessage'
          ),
          default: t('commonTypography.dataWeatherProd'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.determineWeatherData.status.id],
          icon: <IconCheck />,
        });
        router.push('/input-data/production/weather');
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

  const isShowButtonValidation = includesWaiting.includes(
    weatherData?.status?.id ?? ''
  );

  const isShowButtonInvalidation = includesWaiting.includes(
    weatherData?.status?.id ?? ''
  );

  const isShowButtonDetermined = includesValid.includes(
    weatherData?.status?.id ?? ''
  );

  const isShowButtonReject = includesValid.includes(
    weatherData?.status?.id ?? ''
  );
  const isHiddenButtonEdit = includesDetermined.includes(
    weatherData?.status?.id ?? ''
  );

  return (
    <DashboardCard
      title={t('weatherProd.readWeatherProd')}
      updateButton={
        isHiddenButtonEdit
          ? undefined
          : {
              label: 'Edit',
              onClick: () =>
                router.push(`/input-data/production/weather/update/${id}`),
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
        onClick: () => router.push('/input-data/production/weather'),
      }}
      shadow="xs"
      isLoading={weatherDataLoading}
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
          {weatherData?.status?.id ===
          'af06163a-2ba3-45ee-a724-ab3af0c97cc9' ? (
            <GlobalAlert
              description={weatherData?.statusMessage ?? ''}
              title={t('commonTypography.invalidData')}
              color="red"
              mt="xs"
            />
          ) : null}
          {weatherData?.status?.id ===
          '7848a063-ae40-4a80-af86-dfc532cbb688' ? (
            <GlobalAlert
              description={weatherData?.statusMessage ?? ''}
              title={t('commonTypography.rejectedData')}
              color="red"
              mt="xs"
            />
          ) : null}
          <Stack spacing="sm" mt="md">
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.date'),
                  value: formatDate(weatherData?.date),
                },
              ]}
              type="grid"
              keyStyleText={{
                fw: 400,
                fz: 20,
              }}
              valueStyleText={{
                fw: 600,
                fz: 20,
              }}
            />
          </Stack>
          <Stack spacing="sm" mt="md">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.checkerInformation')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.checkerFromName'),
                  value: weatherData?.checker?.humanResource.name,
                },
                {
                  dataKey: t('commonTypography.nip'),
                  value: weatherData?.checker?.nip,
                },
                {
                  dataKey: t('commonTypography.location'),
                  value: weatherData?.location?.name,
                },
              ]}
              type="grid"
              keyStyleText={{
                fw: 400,
                fz: 20,
              }}
              valueStyleText={{
                fw: 600,
                fz: 20,
              }}
            />
          </Stack>
          <Divider my="md" />
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.weather')}
            </Text>
            <MantineDataTable
              tableProps={{
                records: weatherData?.weatherDataConditions ?? [],
                idAccessor: (record) => {
                  const key =
                    weatherData?.weatherDataConditions &&
                    weatherData?.weatherDataConditions.indexOf(record) + 1;
                  return `${key}`;
                },
                defaultColumnProps: {
                  textAlignment: 'left',
                  titleStyle: {
                    paddingTop: 0,
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: 18,
                    fontWeight: 600,
                    color: theme.colors.dark[5],
                  },
                  cellsStyle: {
                    border: 'none',
                    fontSize: 16,
                    fontWeight: 400,
                    color: theme.colors.dark[3],
                  },
                  noWrap: false,
                },
                columns: [
                  {
                    accessor: 'condition',
                    title: t('commonTypography.condition'),
                    render: ({ condition }) => condition?.name,
                  },
                  {
                    accessor: 'startTime',
                    title: t('commonTypography.startTime'),
                    render: ({ startAt }) => formatDate(startAt, 'hh:mm:ss A'),
                  },
                  {
                    accessor: 'endTime',
                    title: t('commonTypography.endTime'),
                    render: ({ finishAt }) =>
                      formatDate(finishAt, 'hh:mm:ss A'),
                  },
                  {
                    accessor: 'rainfall',
                    title: t('commonTypography.rainfall'),
                    render: ({ rainfall }) => rainfall,
                  },
                ],
                horizontalSpacing: 0,
                highlightOnHover: false,
                withBorder: false,
                shadow: 'none',
                minHeight:
                  weatherData?.weatherDataConditions &&
                  weatherData?.weatherDataConditions?.length > 0
                    ? 0
                    : 320,
                borderColor: 'none',
                rowBorderColor: 'none',
              }}
              emptyStateProps={{
                title: t('commonTypography.dataNotfound'),
              }}
            />
          </Stack>
          <Divider my="md" />
          <Stack spacing="sm">
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.desc'),
                  value: weatherData?.desc,
                },
              ]}
              type="grid"
              keyStyleText={{
                fw: 400,
                fz: 20,
              }}
              valueStyleText={{
                fw: 600,
                fz: 20,
              }}
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </DashboardCard>
  );
};

export default ReadWeatherProductionBook;
