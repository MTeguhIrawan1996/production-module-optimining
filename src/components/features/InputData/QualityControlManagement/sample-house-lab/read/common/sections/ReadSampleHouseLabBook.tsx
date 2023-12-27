import { zodResolver } from '@hookform/resolvers/zod';
import { Divider, Stack, Tabs, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
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

import { useUpdateIsDeterminedSampleHouseLab } from '@/services/graphql/mutation/sample-house-lab/useIsDeterminedSampleHouseLab';
import { useUpdateIsValidateSampleHouseLab } from '@/services/graphql/mutation/sample-house-lab/useIsValidateSampleHouseLab';
import { useReadOneSampleHouseLab } from '@/services/graphql/query/sample-house-lab/useReadOneSampleHouseLab';
import { statusValidationSchema } from '@/utils/form-validation/status-validation/status-mutation-validation';
import { formatDate } from '@/utils/helper/dateFormat';

import { IElementWithValue, IUpdateStatusValues } from '@/types/global';

const ReadSampleHouseLabBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [bulkSamplingCategory, setBulkSamplingCategory] = React.useState<
    Pick<IKeyValueItemProps, 'value' | 'dataKey'>[]
  >([]);

  const methods = useForm<IUpdateStatusValues>({
    resolver: zodResolver(statusValidationSchema),
    defaultValues: {
      statusMessage: '',
    },
    mode: 'onSubmit',
  });

  /* #   /**=========== Query =========== */
  const { houseSampleAndLab, houseSampleAndLabLoading } =
    useReadOneSampleHouseLab({
      variables: {
        id,
      },
      skip: !router.isReady,
      onCompleted: (data) => {
        setBulkSamplingCategory(() =>
          data.houseSampleAndLab.subMaterial
            ? [
                {
                  dataKey: t('commonTypography.bulkSamplingCategory'),
                  value: data.houseSampleAndLab.material?.name,
                },
                {
                  dataKey: t('commonTypography.bulkSamplingCategorySub'),
                  value: data.houseSampleAndLab.subMaterial.name,
                },
              ]
            : [
                {
                  dataKey: t('commonTypography.bulkSamplingCategory'),
                  value: data.houseSampleAndLab?.material?.name,
                },
              ]
        );
      },
    });

  const [executeUpdateStatus, { loading }] = useUpdateIsValidateSampleHouseLab({
    onCompleted: (data) => {
      const message = {
        '4d4d646d-d0e5-4f94-ba6d-171be20032fc': t(
          'sampleHouseLab.successIsValidateMessage'
        ),
        'af06163a-2ba3-45ee-a724-ab3af0c97cc9': t(
          'sampleHouseLab.successIsNotValidateMessage'
        ),
        default: t('commonTypography.sampleHouseLab'),
      };
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: message[data.validateHouseSampleAndLab.status.id],
        icon: <IconCheck />,
      });
      router.push('/input-data/quality-control-management/sample-house-lab');
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
    useUpdateIsDeterminedSampleHouseLab({
      onCompleted: (data) => {
        const message = {
          'f5f644d9-8810-44f7-8d42-36b5222b97d1': t(
            'sampleHouseLab.successIsDeterminedMessage'
          ),
          '7848a063-ae40-4a80-af86-dfc532cbb688': t(
            'sampleHouseLab.successIsRejectMessage'
          ),
          default: t('commonTypography.sampleHouseLab'),
        };
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: message[data.determineHouseSampleAndLab.status.id],
          icon: <IconCheck />,
        });
        router.push('/input-data/quality-control-management/sample-house-lab');
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

  const yourPhoto = houseSampleAndLab?.photo
    ? [
        {
          type: 'photo',
          alt: houseSampleAndLab?.photo?.fileName,
          fileName: houseSampleAndLab?.photo?.originalFileName,
          src: houseSampleAndLab?.photo?.url,
        },
      ]
    : [];

  const renderOtherGcElementCallback = React.useCallback(
    (gcElement: IElementWithValue) => {
      const column: Pick<IKeyValueItemProps, 'value' | 'dataKey'> = {
        dataKey: `${gcElement.element?.name} ${t(
          'commonTypography.estimationGC'
        )}`,
        value: `${gcElement.value ?? '-'}`,
      };
      return column;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const renderOtherGcElement =
    houseSampleAndLab?.gradeControlElements?.map(
      renderOtherGcElementCallback
    ) ?? [];

  const renderOtherLabElementCallback = React.useCallback(
    (labElement: IElementWithValue) => {
      const column: Pick<IKeyValueItemProps, 'value' | 'dataKey'> = {
        dataKey: `${labElement.element?.name} ${t(
          'commonTypography.percentageLab'
        )}`,
        value: `${labElement.value ?? '-'}`,
      };
      return column;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const renderOtherLabElement =
    houseSampleAndLab?.elements?.map(renderOtherLabElementCallback) ?? [];

  const handleIsValid = async () => {
    await executeUpdateStatus({
      variables: {
        id,
        status: true,
        statusMessage: null,
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
    houseSampleAndLab?.status?.id ?? ''
  );

  const isShowButtonInvalidation = includesWaiting.includes(
    houseSampleAndLab?.status?.id ?? ''
  );

  const isShowButtonDetermined = includesValid.includes(
    houseSampleAndLab?.status?.id ?? ''
  );

  const isShowButtonReject = includesValid.includes(
    houseSampleAndLab?.status?.id ?? ''
  );

  const isHiddenButtonEdit = includesDetermined.includes(
    houseSampleAndLab?.status?.id ?? ''
  );

  return (
    <DashboardCard
      title={t('sampleHouseLab.readSampleHouseLab')}
      updateButton={
        isHiddenButtonEdit
          ? undefined
          : {
              label: 'Edit',
              onClick: () =>
                router.push(
                  `/input-data/quality-control-management/sample-house-lab/update/${id}`
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
            '/input-data/quality-control-management/sample-house-lab'
          ),
      }}
      shadow="xs"
      isLoading={houseSampleAndLabLoading}
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
          {houseSampleAndLab?.status?.id ===
          'af06163a-2ba3-45ee-a724-ab3af0c97cc9' ? (
            <GlobalAlert
              description={houseSampleAndLab?.statusMessage ?? ''}
              title={t('commonTypography.invalidData')}
              color="red"
              mt="xs"
            />
          ) : null}
          {houseSampleAndLab?.status?.id ===
          '7848a063-ae40-4a80-af86-dfc532cbb688' ? (
            <GlobalAlert
              description={houseSampleAndLab?.statusMessage ?? ''}
              title={t('commonTypography.rejectedData')}
              color="red"
              mt="xs"
            />
          ) : null}
          {!houseSampleAndLabLoading && houseSampleAndLab ? (
            <>
              <GlobalHeaderDetail
                data={[...yourPhoto]}
                title="document"
                pt="md"
              />
              <Divider my="md" />
            </>
          ) : null}
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('sampleHouseLab.qualityMaterialInformation')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.laboratoriumName'),
                  value: houseSampleAndLab?.laboratoriumName,
                },
                {
                  dataKey: t('commonTypography.sampleDate'),
                  value: formatDate(houseSampleAndLab?.sampleDate),
                },
                {
                  dataKey: t('commonTypography.shift'),
                  value: houseSampleAndLab?.shift?.name,
                },
                {
                  dataKey: t('commonTypography.sampleNumber'),
                  value: houseSampleAndLab?.sampleNumber,
                },
                {
                  dataKey: t('commonTypography.sampleName'),
                  value: houseSampleAndLab?.sampleName,
                },
                {
                  dataKey: t('commonTypography.sampleType'),
                  value: houseSampleAndLab?.sampleType?.name,
                },
                ...bulkSamplingCategory,
                {
                  dataKey: t('commonTypography.samplerName'),
                  value: houseSampleAndLab?.sampler?.humanResource?.name ?? '-',
                },
                {
                  dataKey: t('commonTypography.gcName'),
                  value:
                    houseSampleAndLab?.gradeControl?.humanResource?.name ?? '-',
                },
                {
                  dataKey: t('commonTypography.location'),
                  value:
                    houseSampleAndLab && houseSampleAndLab.locationName
                      ? houseSampleAndLab?.locationName ?? '-'
                      : houseSampleAndLab?.location?.name ?? '-',
                },
                {
                  dataKey: t('commonTypography.sampleEnterLabAt'),
                  value: formatDate(houseSampleAndLab?.sampleEnterLabAt),
                },
                {
                  dataKey: t('commonTypography.sampleEnterLabHour'),
                  value: formatDate(
                    houseSampleAndLab?.sampleEnterLabAt,
                    'hh:mm A'
                  ),
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
            {renderOtherGcElement.length > 0 ? (
              <KeyValueList
                data={[...renderOtherGcElement]}
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
                  dataKey: t('commonTypography.density'),
                  value: `${houseSampleAndLab?.density ?? '-'}`,
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
              {t('commonTypography.preparationTime')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.preparationStartDate'),
                  value: formatDate(houseSampleAndLab?.preparationStartAt),
                },
                {
                  dataKey: t('commonTypography.preparationStartHour'),
                  value: formatDate(
                    houseSampleAndLab?.preparationStartAt,
                    'hh:mm A'
                  ),
                },
                {
                  dataKey: t('commonTypography.preparationEndDate'),
                  value: formatDate(houseSampleAndLab?.preparationFinishAt),
                },
                {
                  dataKey: t('commonTypography.preparationEndHour'),
                  value: formatDate(
                    houseSampleAndLab?.preparationFinishAt,
                    'hh:mm A'
                  ),
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
              {t('commonTypography.analysisTime')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.analysisStartDate'),
                  value: formatDate(houseSampleAndLab?.analysisStartAt),
                },
                {
                  dataKey: t('commonTypography.analysisStartHour'),
                  value: formatDate(
                    houseSampleAndLab?.analysisStartAt,
                    'hh:mm A'
                  ),
                },
                {
                  dataKey: t('commonTypography.analysisEndDate'),
                  value: formatDate(houseSampleAndLab?.analysisFinishAt),
                },
                {
                  dataKey: t('commonTypography.analysisEndHour'),
                  value: formatDate(
                    houseSampleAndLab?.analysisFinishAt,
                    'hh:mm A'
                  ),
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
            {renderOtherLabElement.length > 0 ? (
              <KeyValueList
                data={[...renderOtherLabElement]}
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
        </Tabs.Panel>
      </Tabs>
    </DashboardCard>
  );
};

export default ReadSampleHouseLabBook;
