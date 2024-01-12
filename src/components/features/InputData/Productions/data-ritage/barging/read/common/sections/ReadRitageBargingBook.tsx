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

import { useUpdateIsDeterminedBargingRitage } from '@/services/graphql/mutation/barging-ritage/useIsDeterminedBargingRitage';
import { useUpdateIsValidateBargingRitage } from '@/services/graphql/mutation/barging-ritage/useIsValidateBargingRitage';
import { useReadOneBargingRitage } from '@/services/graphql/query/barging-ritage/useReadOneBargingRitage';
import { statusValidationSchema } from '@/utils/form-validation/status-validation/status-mutation-validation';
import { formatDate, secondsDuration } from '@/utils/helper/dateFormat';

import { IElementWithValue, IFile, IUpdateStatusValues } from '@/types/global';

const ReadRitageBargingBook = () => {
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
  const { bargingRitage, bargingRitageLoading } = useReadOneBargingRitage({
    variables: {
      id,
    },
    skip: !router.isReady,
  });

  const [executeUpdateStatus, { loading }] = useUpdateIsValidateBargingRitage({
    onCompleted: (data) => {
      const message = {
        '4d4d646d-d0e5-4f94-ba6d-171be20032fc': t(
          'ritageBarging.successIsValidateMessage'
        ),
        'af06163a-2ba3-45ee-a724-ab3af0c97cc9': t(
          'ritageBarging.successIsNotValidateMessage'
        ),
        default: t('commonTypography.dataRitageBarging'),
      };
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: message[data.validateBargingRitage.status.id],
        icon: <IconCheck />,
      });
      router.push('/input-data/production/data-ritage?tabs=barging');
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
    useUpdateIsDeterminedBargingRitage({
      onCompleted: (data) => {
        const message = {
          'f5f644d9-8810-44f7-8d42-36b5222b97d1': t(
            'ritageBarging.successIsDeterminedMessage'
          ),
          '7848a063-ae40-4a80-af86-dfc532cbb688': t(
            'ritageBarging.successIsRejectMessage'
          ),
          default: t('commonTypography.dataRitageBarging'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.determineBargingRitage.status.id],
          icon: <IconCheck />,
        });
        router.push('/input-data/production/data-ritage?tabs=barging');
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
  const photosItem = bargingRitage?.photos?.map(photosCallback);

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
    bargingRitage?.houseSampleAndLab?.elements?.map(
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
    bargingRitage?.status?.id ?? ''
  );

  const isShowButtonInvalidation = includesWaiting.includes(
    bargingRitage?.status?.id ?? ''
  );

  const isShowButtonDetermined = includesValid.includes(
    bargingRitage?.status?.id ?? ''
  );

  const isShowButtonReject = includesValid.includes(
    bargingRitage?.status?.id ?? ''
  );
  const isHiddenButtonEdit = includesDetermined.includes(
    bargingRitage?.status?.id ?? ''
  );

  return (
    <DashboardCard
      title={t('ritageBarging.readRitageBarging')}
      updateButton={
        isHiddenButtonEdit
          ? undefined
          : {
              label: 'Edit',
              onClick: () =>
                router.push(
                  `/input-data/production/data-ritage/barging/update/${id}`
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
          router.push('/input-data/production/data-ritage?tabs=barging'),
      }}
      shadow="xs"
      isLoading={bargingRitageLoading}
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
          {bargingRitage?.status?.id ===
          'af06163a-2ba3-45ee-a724-ab3af0c97cc9' ? (
            <GlobalAlert
              description={bargingRitage?.statusMessage ?? ''}
              title={t('commonTypography.invalidData')}
              color="red"
              mt="xs"
            />
          ) : null}
          {bargingRitage?.status?.id ===
          '7848a063-ae40-4a80-af86-dfc532cbb688' ? (
            <GlobalAlert
              description={bargingRitage?.statusMessage ?? ''}
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
                  value: formatDate(bargingRitage?.date) ?? '-',
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
          {!bargingRitageLoading && bargingRitage ? (
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
                  value: bargingRitage?.checkerFrom?.humanResource?.name,
                },
                {
                  dataKey: t('commonTypography.fromCheckerPosition'),
                  value: bargingRitage?.checkerFromPosition,
                },
                {
                  dataKey: t('commonTypography.checkerToName'),
                  value: bargingRitage?.checkerTo?.humanResource?.name,
                },
                {
                  dataKey: t('commonTypography.toCheckerPosition'),
                  value: bargingRitage?.checkerToPosition,
                },
                {
                  dataKey: t('commonTypography.shift'),
                  value: bargingRitage?.shift?.name,
                },
                {
                  dataKey: t('commonTypography.heavyEquipmentCode'),
                  value: bargingRitage?.companyHeavyEquipment?.hullNumber,
                },
                {
                  dataKey: t('commonTypography.heavyEquipmentCodeSubstitution'),
                  value: bargingRitage?.companyHeavyEquipmentChange?.hullNumber,
                },
                {
                  dataKey: t('commonTypography.material'),
                  value: bargingRitage?.material?.name,
                },
                {
                  dataKey: t('commonTypography.subMaterial'),
                  value: bargingRitage?.subMaterial?.name,
                },
                {
                  dataKey: t('commonTypography.weather'),
                  value: bargingRitage?.weather?.name,
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
                  value: formatDate(bargingRitage?.fromAt, 'hh:mm:ss A') ?? '-',
                },
                {
                  dataKey: t('commonTypography.arriveAt'),
                  value:
                    formatDate(bargingRitage?.arriveAt, 'hh:mm:ss A') ?? '-',
                },
                {
                  dataKey: t('commonTypography.ritageDuration'),
                  value: secondsDuration(bargingRitage?.duration ?? null),
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
                  dataKey: t('commonTypography.fromStockpile'),
                  value: bargingRitage?.dome?.stockpile?.name,
                },
                {
                  dataKey: t('commonTypography.dome'),
                  value: bargingRitage?.dome?.name,
                },
                {
                  dataKey: t('commonTypography.toBarging'),
                  value: bargingRitage?.barging?.name,
                },
                {
                  dataKey: t('commonTypography.bargeCode'),
                  value: bargingRitage?.bargeCompanyHeavyEquipment?.hullNumber,
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
                  value: `${bargingRitage?.bucketVolume ?? '-'}`,
                },
                {
                  dataKey: t('commonTypography.bulkSamplingDensity'),
                  value: `${bargingRitage?.bulkSamplingDensity ?? '-'}`,
                },
                {
                  dataKey: t('commonTypography.tonByRitage'),
                  value: `${bargingRitage?.tonByRitage ?? '-'}`,
                },
                {
                  dataKey: t('commonTypography.sampleNumber'),
                  value: bargingRitage?.sampleNumber,
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
                  value: bargingRitage?.desc,
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

export default ReadRitageBargingBook;
