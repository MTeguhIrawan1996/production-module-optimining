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

import { useUpdateIsDeterminedTopsoilRitage } from '@/services/graphql/mutation/topsoil-ritage/useIsDeterminedTopsoilRitage';
import { useUpdateIsValidateTopsoilRitage } from '@/services/graphql/mutation/topsoil-ritage/useIsValidateTopsoilRitage';
import { useReadOneTopsoilRitage } from '@/services/graphql/query/topsoil-ritage/useReadOneTopsoilRitage';
import { statusValidationSchema } from '@/utils/form-validation/status-validation/status-mutation-validation';
import { formatDate, secondsDuration } from '@/utils/helper/dateFormat';

import { IFile, IUpdateStatusValues } from '@/types/global';

const ReadRitageTopsoilBook = () => {
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
  const { topsoilRitage, topsoilRitageLoading } = useReadOneTopsoilRitage({
    variables: {
      id,
    },
    skip: !router.isReady,
  });

  const [executeUpdateStatus, { loading }] = useUpdateIsValidateTopsoilRitage({
    onCompleted: (data) => {
      const message = {
        '4d4d646d-d0e5-4f94-ba6d-171be20032fc': t(
          'ritageTopsoil.successIsValidateMessage'
        ),
        'af06163a-2ba3-45ee-a724-ab3af0c97cc9': t(
          'ritageTopsoil.successIsNotValidateMessage'
        ),
        default: t('commonTypography.dataRitageTopsoil'),
      };
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: message[data.validateTopsoilRitage.status.id],
        icon: <IconCheck />,
      });
      router.push('/input-data/production/data-ritage?tabs=topsoil');
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
    useUpdateIsDeterminedTopsoilRitage({
      onCompleted: (data) => {
        const message = {
          'f5f644d9-8810-44f7-8d42-36b5222b97d1': t(
            'ritageTopsoil.successIsDeterminedMessage'
          ),
          '7848a063-ae40-4a80-af86-dfc532cbb688': t(
            'ritageTopsoil.successIsRejectMessage'
          ),
          default: t('commonTypography.dataRitageTopsoil'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.determineTopsoilRitage.status.id],
          icon: <IconCheck />,
        });
        router.push('/input-data/production/data-ritage?tabs=topsoil');
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

  const photosCallback = React.useCallback(
    (
      { fileName, originalFileName, url }: Omit<IFile, 'mime' | 'path'>,
      i: number
    ) => {
      i;

      return {
        type: i > 0 ? '' : 'photo',
        fileName: originalFileName,
        src: url,
        alt: fileName,
      };
    },
    []
  );
  const photosItem = topsoilRitage?.photos?.map(photosCallback);

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
    topsoilRitage?.status?.id ?? ''
  );

  const isShowButtonInvalidation = includesWaiting.includes(
    topsoilRitage?.status?.id ?? ''
  );

  const isShowButtonDetermined = includesValid.includes(
    topsoilRitage?.status?.id ?? ''
  );

  const isShowButtonReject = includesValid.includes(
    topsoilRitage?.status?.id ?? ''
  );
  const isHiddenButtonEdit = includesDetermined.includes(
    topsoilRitage?.status?.id ?? ''
  );

  return (
    <DashboardCard
      title={t('ritageTopsoil.readRitageTopsoil')}
      updateButton={
        isHiddenButtonEdit
          ? undefined
          : {
              label: 'Edit',
              onClick: () =>
                router.push(
                  `/input-data/production/data-ritage/topsoil/update/${id}`
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
          router.push('/input-data/production/data-ritage?tabs=topsoil'),
      }}
      shadow="xs"
      isLoading={topsoilRitageLoading}
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
          {topsoilRitage?.status?.id ===
          'af06163a-2ba3-45ee-a724-ab3af0c97cc9' ? (
            <GlobalAlert
              description={topsoilRitage?.statusMessage ?? ''}
              title={t('commonTypography.invalidData')}
              color="red"
              mt="md"
            />
          ) : null}
          {topsoilRitage?.status?.id ===
          '7848a063-ae40-4a80-af86-dfc532cbb688' ? (
            <GlobalAlert
              description={topsoilRitage?.statusMessage ?? ''}
              title={t('commonTypography.rejectedData')}
              color="red"
              mt="md"
            />
          ) : null}
          <Stack spacing="sm" mt="md">
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.date'),
                  value: formatDate(topsoilRitage?.date),
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
          {!topsoilRitageLoading && topsoilRitage ? (
            <>
              <GlobalHeaderDetail
                data={photosItem ?? []}
                title="documentation"
                pt="md"
              />
              <Divider my="md" />
            </>
          ) : null}
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.checkerInformation')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.checkerFromName'),
                  value: topsoilRitage?.checkerFrom?.humanResource?.name,
                },
                {
                  dataKey: t('commonTypography.fromCheckerPosition'),
                  value: topsoilRitage?.checkerFromPosition,
                },
                {
                  dataKey: t('commonTypography.checkerToName'),
                  value: topsoilRitage?.checkerTo?.humanResource?.name,
                },
                {
                  dataKey: t('commonTypography.toCheckerPosition'),
                  value: topsoilRitage?.checkerToPosition,
                },
                {
                  dataKey: t('commonTypography.shift'),
                  value: topsoilRitage?.shift?.name,
                },
                {
                  dataKey: t('commonTypography.heavyEquipmentCode'),
                  value: topsoilRitage?.companyHeavyEquipment?.hullNumber,
                },
                {
                  dataKey: t('commonTypography.heavyEquipmentCodeSubstitution'),
                  value: topsoilRitage?.companyHeavyEquipmentChange?.hullNumber,
                },
                {
                  dataKey: t('commonTypography.material'),
                  value: topsoilRitage?.material?.name,
                },
                {
                  dataKey: t('commonTypography.weather'),
                  value: topsoilRitage?.weather?.name,
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
              {t('commonTypography.ritageDuration')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.fromAt'),
                  value: formatDate(topsoilRitage?.fromAt, 'hh:mm:ss A'),
                },
                {
                  dataKey: t('commonTypography.arriveAt'),
                  value: formatDate(topsoilRitage?.arriveAt, 'hh:mm:ss A'),
                },
                {
                  dataKey: t('commonTypography.ritageDuration'),
                  value: secondsDuration(topsoilRitage?.duration ?? null),
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
              {t('commonTypography.location')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.fromPit'),
                  value: topsoilRitage?.fromPit?.name,
                },
                {
                  dataKey: t('commonTypography.fromFront'),
                  value: topsoilRitage?.fromFront?.name,
                },
                {
                  dataKey: t('commonTypography.fromBlock'),
                  value: topsoilRitage?.fromBlock?.name,
                },
                {
                  dataKey: t('commonTypography.fromGrid'),
                  value: topsoilRitage?.fromGrid?.name,
                },
                {
                  dataKey: t('commonTypography.fromSequence'),
                  value: topsoilRitage?.fromSequence?.name,
                },
                {
                  dataKey: t('commonTypography.fromElevasi'),
                  value: topsoilRitage?.fromElevation?.name,
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
              {t('commonTypography.arrive')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.locationCategory'),
                  value: topsoilRitage?.toLocationCategory?.name,
                },
                {
                  dataKey: t('commonTypography.locationName'),
                  value: topsoilRitage?.toLocation?.name,
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
              {t('commonTypography.detail')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.bucketVolume'),
                  value: `${topsoilRitage?.bucketVolume ?? '-'}`,
                },
                {
                  dataKey: t('commonTypography.bulkSamplingDensity'),
                  value: `${topsoilRitage?.bulkSamplingDensity ?? '-'}`,
                },
                {
                  dataKey: t('commonTypography.tonByRitage'),
                  value: `${topsoilRitage?.tonByRitage ?? '-'}`,
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
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.desc'),
                  value: topsoilRitage?.desc,
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

export default ReadRitageTopsoilBook;
