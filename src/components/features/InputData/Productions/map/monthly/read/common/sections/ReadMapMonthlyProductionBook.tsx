import { zodResolver } from '@hookform/resolvers/zod';
import { Badge, createStyles, Divider, Stack, Tabs, Text } from '@mantine/core';
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
  NextImageFill,
} from '@/components/elements';

import { useDeterminedMapDataProduction } from '@/services/graphql/mutation/input-data-map/useDetermineMap';
import { useValidateMap } from '@/services/graphql/mutation/input-data-map/useValidateMap';
import { useReadOneMap } from '@/services/graphql/query/input-data-map/useReadOneMap';
import { statusValidationSchema } from '@/utils/form-validation/status-validation/status-mutation-validation';

import { IUpdateStatusValues } from '@/types/global';

const useStyles = createStyles(() => ({
  image: {
    objectFit: 'cover',
    backgroundPosition: 'center',
  },
}));

const ReadMapMonthlyProductionBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const { classes } = useStyles();

  const methods = useForm<IUpdateStatusValues>({
    resolver: zodResolver(statusValidationSchema),
    defaultValues: {
      statusMessage: '',
    },
    mode: 'onSubmit',
  });

  /* #   /**=========== Query =========== */
  const { mapData, mapDataLoading } = useReadOneMap({
    variables: {
      id,
    },
    skip: !router.isReady,
  });

  const [executeUpdateStatus, { loading }] = useValidateMap({
    onCompleted: (data) => {
      const message = {
        '4d4d646d-d0e5-4f94-ba6d-171be20032fc': t(
          'mapProduction.successIsValidateMessage'
        ),
        'af06163a-2ba3-45ee-a724-ab3af0c97cc9': t(
          'mapProduction.successIsNotValidateMessage'
        ),
        default: t('commonTypography.map'),
      };
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: message[data.validateMapDataStatus.mapDataStatus.id],
        icon: <IconCheck />,
      });
      router.push('/input-data/production/map/monthly?tabs=monthly');
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
    useDeterminedMapDataProduction({
      onCompleted: (data) => {
        const message = {
          'f5f644d9-8810-44f7-8d42-36b5222b97d1': t(
            'mapProduction.successIsDeterminedMessage'
          ),
          '7848a063-ae40-4a80-af86-dfc532cbb688': t(
            'mapProduction.successIsRejectMessage'
          ),
          default: t('commonTypography.map'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.determineMapDataData.mapDataStatus.id],
          icon: <IconCheck />,
        });
        router.push('/input-data/production/map/monthly?tabs=monthly');
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
    mapData?.mapDataStatus?.id ?? ''
  );

  const isShowButtonInvalidation = includesWaiting.includes(
    mapData?.mapDataStatus?.id ?? ''
  );

  const isShowButtonDetermined = includesValid.includes(
    mapData?.mapDataStatus?.id ?? ''
  );

  const isShowButtonReject = includesValid.includes(
    mapData?.mapDataStatus?.id ?? ''
  );
  const isHiddenButtonEdit = includesDetermined.includes(
    mapData?.mapDataStatus?.id ?? ''
  );

  return (
    <DashboardCard
      title={t('mapProduction.readMapProd')}
      updateButton={
        isHiddenButtonEdit
          ? undefined
          : {
              label: 'Edit',
              onClick: () =>
                router.push(`/input-data/production/map/monthly/update/${id}`),
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
        onClick: () => router.push('/input-data/production/map?tabs=monthly'),
      }}
      shadow="xs"
      isLoading={mapDataLoading}
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
          {mapData?.mapDataStatus?.id ===
          'af06163a-2ba3-45ee-a724-ab3af0c97cc9' ? (
            <GlobalAlert
              description={mapData?.statusMessage ?? ''}
              title={t('commonTypography.invalidData')}
              color="red"
              mt="xs"
            />
          ) : null}
          {mapData?.mapDataStatus?.id ===
          '7848a063-ae40-4a80-af86-dfc532cbb688' ? (
            <GlobalAlert
              description={mapData?.statusMessage ?? ''}
              title={t('commonTypography.rejectedData')}
              color="red"
              mt="xs"
            />
          ) : null}
          <Stack spacing="sm" mt="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.mapInformation')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.mapName'),
                  value: mapData?.name,
                },
                {
                  dataKey: t('commonTypography.mapType'),
                  value: mapData?.mapDataCategory.name,
                },
                {
                  dataKey: t('commonTypography.location'),
                  value: mapData?.mapDataLocation?.map((e) => (
                    <Badge mr="md" key={e.locationId}>
                      {e?.name}
                    </Badge>
                  )),
                },
                {
                  dataKey: t('commonTypography.year'),
                  value: mapData?.year,
                },
                {
                  dataKey: t('commonTypography.month'),
                  value: mapData?.month?.name,
                },
              ]}
              type="grid"
            />
          </Stack>
          <Divider my="md" />
          <Stack spacing="xs">
            <Text fz={24} fw={600} color="brand">
              {`${t('commonTypography.file')} ${t('commonTypography.map')}`}
            </Text>
            <NextImageFill
              alt={mapData?.file?.originalFileName || ''}
              src={
                `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${mapData?.file?.url}` ||
                ''
              }
              figureProps={{
                h: 400,
                w: '100%',
              }}
              imageClassName={classes.image}
            />
            <Text
              component="span"
              align="center"
              fw={400}
              fz={12}
              color="gray.6"
              truncate
            >
              {mapData?.file?.originalFileName}
            </Text>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </DashboardCard>
  );
};

export default ReadMapMonthlyProductionBook;
