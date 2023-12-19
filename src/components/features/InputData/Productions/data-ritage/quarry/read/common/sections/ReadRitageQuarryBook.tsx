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

import { useUpdateIsDeterminedQuarryRitage } from '@/services/graphql/mutation/quarry-ritage/useIsDeterminedQuarryRitage';
import { useUpdateIsValidateQuarryRitage } from '@/services/graphql/mutation/quarry-ritage/useIsValidateQuarryRitage';
import { useReadOneQuarryRitage } from '@/services/graphql/query/quarry-ritage/useReadOneQuarryRitage';
import { statusValidationSchema } from '@/utils/form-validation/status-validation/status-mutation-validation';
import { formatDate, secondsDuration } from '@/utils/helper/dateFormat';

import { IFile, IUpdateStatusValues } from '@/types/global';

const ReadRitageQuarryBook = () => {
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
  const { quarryRitage, quarryRitageLoading } = useReadOneQuarryRitage({
    variables: {
      id,
    },
    skip: !router.isReady,
  });

  const [executeUpdateStatus, { loading }] = useUpdateIsValidateQuarryRitage({
    onCompleted: (data) => {
      const message = {
        '4d4d646d-d0e5-4f94-ba6d-171be20032fc': t(
          'ritageQuarry.successIsValidateMessage'
        ),
        'af06163a-2ba3-45ee-a724-ab3af0c97cc9': t(
          'ritageQuarry.successIsNotValidateMessage'
        ),
        default: t('commonTypography.dataRitageQuarry'),
      };
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: message[data.validateQuarryRitage.status.id],
        icon: <IconCheck />,
      });
      router.push('/input-data/production/data-ritage?tabs=quarry');
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
    useUpdateIsDeterminedQuarryRitage({
      onCompleted: (data) => {
        const message = {
          'f5f644d9-8810-44f7-8d42-36b5222b97d1': t(
            'ritageQuarry.successIsDeterminedMessage'
          ),
          '7848a063-ae40-4a80-af86-dfc532cbb688': t(
            'ritageQuarry.successIsRejectMessage'
          ),
          default: t('commonTypography.dataRitageQuarry'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.determineQuarryRitage.status.id],
          icon: <IconCheck />,
        });
        router.push('/input-data/production/data-ritage?tabs=quarry');
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
  const photosItem = quarryRitage?.photos?.map(photosCallback);

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
    quarryRitage?.status?.id ?? ''
  );

  const isShowButtonInvalidation = includesWaiting.includes(
    quarryRitage?.status?.id ?? ''
  );

  const isShowButtonDetermined = includesValid.includes(
    quarryRitage?.status?.id ?? ''
  );

  const isShowButtonReject = includesValid.includes(
    quarryRitage?.status?.id ?? ''
  );
  const isHiddenButtonEdit = includesDetermined.includes(
    quarryRitage?.status?.id ?? ''
  );

  return (
    <DashboardCard
      title={t('ritageQuarry.readRitageQuarry')}
      updateButton={
        isHiddenButtonEdit
          ? undefined
          : {
              label: 'Edit',
              onClick: () =>
                router.push(
                  `/input-data/production/data-ritage/quarry/update/${id}`
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
          router.push('/input-data/production/data-ritage?tabs=quarry'),
      }}
      shadow="xs"
      isLoading={quarryRitageLoading}
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
          {quarryRitage?.status?.id ===
          'af06163a-2ba3-45ee-a724-ab3af0c97cc9' ? (
            <GlobalAlert
              description={quarryRitage?.statusMessage ?? ''}
              title={t('commonTypography.invalidData')}
              color="red"
              mt="md"
            />
          ) : null}
          {quarryRitage?.status?.id ===
          '7848a063-ae40-4a80-af86-dfc532cbb688' ? (
            <GlobalAlert
              description={quarryRitage?.statusMessage ?? ''}
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
                  value: formatDate(quarryRitage?.date),
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
          {!quarryRitageLoading && quarryRitage ? (
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
                  value: quarryRitage?.checkerFrom?.humanResource?.name,
                },
                {
                  dataKey: t('commonTypography.fromCheckerPosition'),
                  value: quarryRitage?.checkerFromPosition,
                },
                {
                  dataKey: t('commonTypography.checkerToName'),
                  value: quarryRitage?.checkerTo?.humanResource?.name,
                },
                {
                  dataKey: t('commonTypography.toCheckerPosition'),
                  value: quarryRitage?.checkerToPosition,
                },
                {
                  dataKey: t('commonTypography.shift'),
                  value: quarryRitage?.shift?.name,
                },
                {
                  dataKey: t('commonTypography.heavyEquipmentCode'),
                  value: quarryRitage?.companyHeavyEquipment?.hullNumber,
                },
                {
                  dataKey: t('commonTypography.heavyEquipmentCodeSubstitution'),
                  value: quarryRitage?.companyHeavyEquipmentChange?.hullNumber,
                },
                {
                  dataKey: t('commonTypography.material'),
                  value: quarryRitage?.material?.name,
                },
                {
                  dataKey: t('commonTypography.weather'),
                  value: quarryRitage?.weather?.name,
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
                  value: formatDate(quarryRitage?.fromAt, 'hh:mm:ss A'),
                },
                {
                  dataKey: t('commonTypography.arriveAt'),
                  value: formatDate(quarryRitage?.arriveAt, 'hh:mm:ss A'),
                },
                {
                  dataKey: t('commonTypography.ritageDuration'),
                  value: secondsDuration(quarryRitage?.duration ?? null),
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
                  value: quarryRitage?.fromPit?.name,
                },
                {
                  dataKey: t('commonTypography.fromFront'),
                  value: quarryRitage?.fromFront?.name,
                },
                {
                  dataKey: t('commonTypography.fromBlock'),
                  value: quarryRitage?.fromBlock?.name,
                },
                {
                  dataKey: t('commonTypography.fromGrid'),
                  value: quarryRitage?.fromGrid?.name,
                },
                {
                  dataKey: t('commonTypography.fromSequence'),
                  value: quarryRitage?.fromSequence?.name,
                },
                {
                  dataKey: t('commonTypography.fromElevasi'),
                  value: quarryRitage?.fromElevation?.name,
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
                  value: quarryRitage?.toLocationCategory?.name,
                },
                {
                  dataKey: t('commonTypography.locationName'),
                  value: quarryRitage?.toLocation?.name,
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
                  value: `${quarryRitage?.bucketVolume ?? '-'}`,
                },
                {
                  dataKey: t('commonTypography.bulkSamplingDensity'),
                  value: `${quarryRitage?.bulkSamplingDensity ?? '-'}`,
                },
                {
                  dataKey: t('commonTypography.tonByRitage'),
                  value: `${quarryRitage?.tonByRitage ?? '-'}`,
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
                  value: quarryRitage?.desc,
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

export default ReadRitageQuarryBook;
