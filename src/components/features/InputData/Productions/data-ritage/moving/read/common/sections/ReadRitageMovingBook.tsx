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

import { useUpdateIsDeterminedMovingRitage } from '@/services/graphql/mutation/moving-ritage/useIsDeterminedMovingRitage';
import { useUpdateIsValidateMovingRitage } from '@/services/graphql/mutation/moving-ritage/useIsValidateMovingRitage';
import { useReadOneMovingRitage } from '@/services/graphql/query/moving-ritage/useReadOneMovingRitage';
import { statusValidationSchema } from '@/utils/form-validation/status-validation/status-mutation-validation';
import { formatDate, secondsDuration } from '@/utils/helper/dateFormat';

import { IElementWithValue, IFile, IUpdateStatusValues } from '@/types/global';

const ReadRitageMovingBook = () => {
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
  const { movingRitage, movingRitageLoading } = useReadOneMovingRitage({
    variables: {
      id,
    },
    skip: !router.isReady,
  });

  const [executeUpdateStatus, { loading }] = useUpdateIsValidateMovingRitage({
    onCompleted: (data) => {
      const message = {
        '4d4d646d-d0e5-4f94-ba6d-171be20032fc': t(
          'ritageMoving.successIsValidateMessage'
        ),
        'af06163a-2ba3-45ee-a724-ab3af0c97cc9': t(
          'ritageMoving.successIsNotValidateMessage'
        ),
        default: t('commonTypography.dataRitageMoving'),
      };
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: message[data.validateMovingRitage.status.id],
        icon: <IconCheck />,
      });
      router.push('/input-data/production/data-ritage?tabs=moving');
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
    useUpdateIsDeterminedMovingRitage({
      onCompleted: (data) => {
        const message = {
          'f5f644d9-8810-44f7-8d42-36b5222b97d1': t(
            'ritageMoving.successIsDeterminedMessage'
          ),
          '7848a063-ae40-4a80-af86-dfc532cbb688': t(
            'ritageMoving.successIsRejectMessage'
          ),
          default: t('commonTypography.dataRitageMoving'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.determineMovingRitage.status.id],
          icon: <IconCheck />,
        });
        router.push('/input-data/production/data-ritage?tabs=moving');
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
  const photosItem = movingRitage?.photos?.map(photosCallback);

  const renderOtherElementCallback = React.useCallback(
    (element: IElementWithValue) => {
      const column: Pick<IKeyValueItemProps, 'value' | 'dataKey'> = {
        dataKey: `${element.element?.name}`,
        value: `${element.value ?? '-'}`,
      };
      return column;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const renderOtherElement =
    movingRitage?.houseSampleAndLab?.elements?.map(
      renderOtherElementCallback
    ) ?? [];

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
    movingRitage?.status?.id ?? ''
  );

  const isShowButtonInvalidation = includesWaiting.includes(
    movingRitage?.status?.id ?? ''
  );

  const isShowButtonDetermined = includesValid.includes(
    movingRitage?.status?.id ?? ''
  );

  const isShowButtonReject = includesValid.includes(
    movingRitage?.status?.id ?? ''
  );
  const isHiddenButtonEdit = includesDetermined.includes(
    movingRitage?.status?.id ?? ''
  );

  return (
    <DashboardCard
      title={t('ritageMoving.readRitageMoving')}
      updateButton={
        isHiddenButtonEdit
          ? undefined
          : {
              label: 'Edit',
              onClick: () =>
                router.push(
                  `/input-data/production/data-ritage/moving/update/${id}`
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
          router.push('/input-data/production/data-ritage?tabs=moving'),
      }}
      shadow="xs"
      isLoading={movingRitageLoading}
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
          {movingRitage?.status?.id ===
          'af06163a-2ba3-45ee-a724-ab3af0c97cc9' ? (
            <GlobalAlert
              description={movingRitage?.statusMessage ?? ''}
              title={t('commonTypography.invalidData')}
              color="red"
              mt="md"
            />
          ) : null}
          {movingRitage?.status?.id ===
          '7848a063-ae40-4a80-af86-dfc532cbb688' ? (
            <GlobalAlert
              description={movingRitage?.statusMessage ?? ''}
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
                  value: formatDate(movingRitage?.date),
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
          {!movingRitageLoading && movingRitage ? (
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
                  value: movingRitage?.checkerFrom?.humanResource?.name,
                },
                {
                  dataKey: t('commonTypography.fromCheckerPosition'),
                  value: movingRitage?.checkerFromPosition,
                },
                {
                  dataKey: t('commonTypography.checkerToName'),
                  value: movingRitage?.checkerTo?.humanResource?.name,
                },
                {
                  dataKey: t('commonTypography.toCheckerPosition'),
                  value: movingRitage?.checkerToPosition,
                },
                {
                  dataKey: t('commonTypography.shift'),
                  value: movingRitage?.shift?.name,
                },
                {
                  dataKey: t('commonTypography.heavyEquipmentCode'),
                  value: movingRitage?.companyHeavyEquipment?.hullNumber,
                },
                {
                  dataKey: t('commonTypography.heavyEquipmentCodeSubstitution'),
                  value: movingRitage?.companyHeavyEquipmentChange?.hullNumber,
                },
                {
                  dataKey: t('commonTypography.material'),
                  value: movingRitage?.material?.name,
                },
                {
                  dataKey: t('commonTypography.subMaterial'),
                  value: movingRitage?.subMaterial?.name,
                },
                {
                  dataKey: t('commonTypography.weather'),
                  value: movingRitage?.weather?.name,
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
                  value: formatDate(movingRitage?.fromAt, 'hh:mm:ss A'),
                },
                {
                  dataKey: t('commonTypography.arriveAt'),
                  value: formatDate(movingRitage?.arriveAt, 'hh:mm:ss A'),
                },
                {
                  dataKey: t('commonTypography.ritageDuration'),
                  value: secondsDuration(movingRitage?.duration ?? null),
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
                  dataKey: t('commonTypography.fromDome'),
                  value: movingRitage?.fromDome?.name,
                },
                {
                  dataKey: t('commonTypography.toDome'),
                  value: movingRitage?.toDome?.name,
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
                  value: `${movingRitage?.bucketVolume ?? '-'}`,
                },
                {
                  dataKey: t('commonTypography.bulkSamplingDensity'),
                  value: `${movingRitage?.bulkSamplingDensity ?? '-'}`,
                },
                {
                  dataKey: t('commonTypography.tonByRitage'),
                  value: `${movingRitage?.tonByRitage ?? '-'}`,
                },
                {
                  dataKey: t('commonTypography.sampleNumber'),
                  value: movingRitage?.sampleNumber,
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
              {t('commonTypography.rate')}
            </Text>
            {renderOtherElement.length > 0 ? (
              <KeyValueList
                data={[...renderOtherElement]}
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
            ) : (
              <Text color="gray.6">{t(`commonTypography.rateNotFound`)}</Text>
            )}
          </Stack>
          <Divider my="md" />
          <Stack spacing="sm">
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.desc'),
                  value: movingRitage?.desc,
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

export default ReadRitageMovingBook;
