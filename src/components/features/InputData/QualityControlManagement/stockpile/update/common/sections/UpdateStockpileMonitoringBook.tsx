import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import {
  FieldArrayWithId,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, SteperFormGroup } from '@/components/elements';

import {
  IMutationUpdateSampleMonitoringStockpileValues,
  useUpdateSampleStockpileMonitoring,
} from '@/services/graphql/mutation/stockpile-monitoring/useUpdateSampleStockpileMonitoring';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import { useReadOneSampleHouseLabByNumberSample } from '@/services/graphql/query/sample-house-lab/useReadOneSampleHouseLabByNoSample';
import { useReadOneStockpileMonitoringDetail } from '@/services/graphql/query/stockpile-monitoring/useReadOneStockpileMonitoringDetail';
import { useReadOneStockpileMonitoringRitage } from '@/services/graphql/query/stockpile-monitoring/useReadOneStockpileMonitoringRitage';
import { useReadOneStockpileMonitoringSample } from '@/services/graphql/query/stockpile-monitoring/useReadOneStockpileMonitoringSample';
import { useReadOneStockpileMonitoringSurvey } from '@/services/graphql/query/stockpile-monitoring/useReadOneStockpileMonitoringSurvey';
import {
  IMutationStockpile,
  IMutationStockpileStepOne,
  useUpdateStockpileMonitoring,
} from '@/services/restapi/stockpile-monitoring/useUpdateStockpileMonitoring';
import {
  globalDate,
  globalNumberInput,
  globalText,
  globalTimeInput,
  materialSelect,
} from '@/utils/constants/Field/global-field';
import { sampleTypeSelect } from '@/utils/constants/Field/sample-house-field';
import {
  domeNameSelect,
  stockpileNameSelect,
} from '@/utils/constants/Field/stockpile-field';
import { stockpileMonitoringMutationValidation } from '@/utils/form-validation/stockpile-monitoring/stockpile-monitoring-validation';
import { sendGAEvent } from '@/utils/helper/analytics';
import { formatDate } from '@/utils/helper/dateFormat';
import { dateToString, stringToDate } from '@/utils/helper/dateToString';
import {
  errorBadRequestField,
  errorRestBadRequestField,
} from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import {
  ControllerGroup,
  ControllerProps,
  IElementRhf,
  IFile,
} from '@/types/global';

type fieldName = keyof IMutationStockpileStepOne;

const UpdateStockpileMonitoringBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [active, setActive] = React.useState(0);
  const [otherElements, setOtherElements] = React.useState<IElementRhf[]>([]);
  const [serverPhoto, setServerPhoto] = React.useState<
    Omit<IFile, 'mime' | 'path'>[] | null
  >([]);
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);
  const [indexOfSample, setIndexOfSample] = useDebouncedState<number | null>(
    null,
    500
  );
  const [sampleNumber, setSampleNumber] = useDebouncedState<string>('', 500);
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationStockpile>({
    resolver: zodResolver(stockpileMonitoringMutationValidation),
    defaultValues: {
      stockpileId: '',
      domeId: '',
      handbookId: '',
      oreSubMaterialId: '',
      openDate: undefined,
      openTime: '',
      closeDate: undefined,
      closeTime: '',
      tonSurveys: [],
      tonByRitage: '',
      desc: '',
      samples: [],
      photo: [],
    },
    mode: 'onBlur',
  });

  const {
    fields: sampleFields,
    append,
    remove,
    replace,
  } = useFieldArray({
    name: 'samples',
    control: methods.control,
  });
  const {
    fields: surveyFields,
    replace: replaceSurveyFields,
    remove: removeSurveyFields,
    append: appendSurveyFields,
  } = useFieldArray({
    name: 'tonSurveys',
    control: methods.control,
  });
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */

  const { elementsData } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      const other = data.elements.data.map((val) => {
        return {
          elementId: val.id,
          name: val.name,
          value: '',
        };
      });
      setOtherElements(other);
    },
  });

  const isOwnElemntsData =
    elementsData && elementsData.length > 0 ? true : false;

  useReadOneSampleHouseLabByNumberSample({
    variables: {
      sampleNumber: sampleNumber,
    },
    skip: !isOwnElemntsData,
    onCompleted: (data) => {
      const date = stringToDate(
        data.houseSampleAndLabBySampleNumber.sampleDate ?? null
      );
      const elemntsValue = elementsData?.map((o) => {
        const value = data.houseSampleAndLabBySampleNumber?.elements?.find(
          (obj) => obj.element?.id === o.id
        );
        return {
          elementId: o.id,
          name: o.name ?? '',
          value: value?.value ?? '',
        };
      });
      if (elemntsValue && elemntsValue?.length > 0) {
        methods.setValue(
          `samples.${indexOfSample as number}.elements`,
          elemntsValue
        );
      }
      methods.setValue(`samples.${indexOfSample as number}.date`, date);
      methods.setValue(
        `samples.${indexOfSample as number}.sampleTypeId`,
        data.houseSampleAndLabBySampleNumber.sampleType?.id ?? ''
      );
    },
    onError: () => {
      methods.setValue(`samples.${indexOfSample as number}.sampleTypeId`, '');
      methods.setValue(`samples.${indexOfSample as number}.date`, undefined);
      methods.setValue(
        `samples.${indexOfSample as number}.elements`,
        otherElements
      );
    },
  });

  const { monitoringStockpileDetail, monitoringStockpileDetailLoading } =
    useReadOneStockpileMonitoringDetail({
      variables: {
        id,
      },
      skip: !router.isReady || !isOwnElemntsData,
      onCompleted: ({ monitoringStockpileDetail }) => {
        const openDate = stringToDate(monitoringStockpileDetail.openAt ?? null);
        const closeDate = stringToDate(
          monitoringStockpileDetail.closeAt ?? null
        );
        const openTime = formatDate(
          monitoringStockpileDetail.openAt,
          'HH:mm:ss'
        );
        const closeTime = formatDate(
          monitoringStockpileDetail.closeAt,
          'HH:mm:ss'
        );
        methods.setValue(
          'stockpileId',
          monitoringStockpileDetail.dome?.stockpile.id ?? ''
        );
        methods.setValue('domeId', monitoringStockpileDetail.dome?.id ?? '');
        methods.setValue(
          'handbookId',
          monitoringStockpileDetail.dome?.handBookId ?? ''
        );
        methods.setValue(
          'oreSubMaterialId',
          monitoringStockpileDetail.material?.id ?? ''
        );
        methods.setValue('openDate', openDate);
        methods.setValue('closeDate', closeDate);
        methods.setValue('openTime', openTime ?? '');
        methods.setValue('closeTime', closeTime ?? '');
        methods.setValue('desc', monitoringStockpileDetail.desc ?? '');
        if (monitoringStockpileDetail.photo) {
          setServerPhoto([monitoringStockpileDetail.photo]);
        }
      },
    });

  useReadOneStockpileMonitoringSurvey({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: ({ monitoringStockpileSurvey }) => {
      const surveys = monitoringStockpileSurvey.data.map((val) => {
        const date = stringToDate(val.date ?? null);
        return {
          date: date,
          ton: val.ton ?? '',
          volume: val.volume ?? '',
        };
      });
      replaceSurveyFields(surveys && surveys.length > 0 ? surveys : []);
    },
  });
  useReadOneStockpileMonitoringRitage({
    variables: {
      id,
      limit: 1,
      page: 1,
    },
    skip: !router.isReady,
    onCompleted: ({ monitoringStockpileOreRitage }) => {
      methods.setValue(
        'tonByRitage',
        monitoringStockpileOreRitage.additional?.tonByRitage ?? ''
      );
    },
  });
  useReadOneStockpileMonitoringSample({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: ({ monitoringStockpileSamples }) => {
      const samples = monitoringStockpileSamples.data.map((val) => {
        const elemntsValue = elementsData?.map((o) => {
          const value = val.elements.find((obj) => obj.element.id === o.id);
          return {
            elementId: o.id,
            name: o.name ?? '',
            value: value?.value ?? '',
          };
        });
        return {
          date: stringToDate(val.sampleDate ?? null),
          sampleTypeId: val.sampleType.id ?? '',
          sampleNumber: val.sampleNumber ?? '',
          isCreatedAfterDetermine: val.monitoringStockpileSample
            .isCreatedAfterDetermine
            ? true
            : false,
          elements: elemntsValue ?? [],
        };
      });
      samples.length > 0 ? replace(samples) : replace([]);
    },
  });

  const { mutate, isLoading } = useUpdateStockpileMonitoring({
    onError: (err) => {
      if (err.response) {
        const errorArry = errorRestBadRequestField(err);
        if (errorArry?.length) {
          errorArry?.forEach(({ name, type, message }) => {
            methods.setError(name, { type, message });
          });
          return;
        }
        notifications.show({
          color: 'red',
          title: 'Gagal',
          message: err.response.data.message,
          icon: <IconX />,
        });
      }
    },
    onSuccess: () => {
      sendGAEvent({
        event: 'Edit',
        params: {
          category: 'Monitoring Stockpile',
          subCategory: '',
          subSubCategory: '',
          account: userAuthData?.email ?? '',
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('stockpileMonitoring.successUpdateMessage'),
        icon: <IconCheck />,
      });
      setIsOpenConfirmation((prev) => !prev);
      router.push(
        '/input-data/quality-control-management/stockpile-monitoring'
      );
    },
  });

  const [executeUpdate, { loading }] = useUpdateSampleStockpileMonitoring({
    onCompleted: () => {
      sendGAEvent({
        event: 'Edit',
        params: {
          category: 'Monitoring Stockpile',
          subCategory: '',
          subSubCategory: '',
          account: userAuthData?.email ?? '',
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('stockpileMonitoring.successUpdateMessage'),
        icon: <IconCheck />,
      });
      setIsOpenConfirmation((prev) => !prev);
      router.push(
        '/input-data/quality-control-management/stockpile-monitoring'
      );
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<IMutationStockpile>(error);
        if (errorArry.length) {
          errorArry.forEach(({ name, type, message }) => {
            methods.setError(name, { type, message });
          });
          return;
        }
        notifications.show({
          color: 'red',
          title: 'Gagal',
          message: error.message,
          icon: <IconX />,
        });
      }
    },
  });

  const isDetermination =
    monitoringStockpileDetail?.status?.id ===
    process.env.NEXT_PUBLIC_STATUS_DETERMINED;
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */
  const surveyGroup = React.useCallback(
    (
      val: FieldArrayWithId<IMutationStockpile, 'tonSurveys', 'id'>,
      index: number
    ) => {
      const surveyDateItem = globalDate({
        name: `tonSurveys.${index}.date`,
        label: 'surveyDate',
        withAsterisk: true,
        clearable: true,
        colSpan: 6,
        key: `tonSurveys.${index}.date.${val.id}`,
      });
      const tonBySurveyItem = globalNumberInput({
        colSpan: 6,
        name: `tonSurveys.${index}.ton`,
        label: 'tonBySurvey',
        withAsterisk: true,
        key: `tonSurveys.${index}.ton.${val.id}`,
      });
      const volumeBySurveyItem = globalNumberInput({
        colSpan: 6,
        name: `tonSurveys.${index}.volume`,
        label: 'volumeBySurvey',
        withAsterisk: true,
        key: `tonSurveys.${index}.volume.${val.id}`,
      });

      const group: ControllerGroup = {
        group: t('commonTypography.survey'),
        enableGroupLabel: true,
        formControllers: [surveyDateItem, tonBySurveyItem, volumeBySurveyItem],
        actionGroup: {
          deleteButton: {
            label: t('commonTypography.delete'),
            onClick: () => {
              removeSurveyFields(index);
            },
          },
        },
      };
      return group;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [surveyFields]
  );
  const surveyGroupItem = surveyFields.map(surveyGroup);

  const sampleGroup = React.useCallback(
    (
      val: FieldArrayWithId<IMutationStockpile, 'samples', 'id'>,
      index: number
    ) => {
      const elementItem = elementsData?.map((obj, i) => {
        const elementInput = globalNumberInput({
          name: `samples.${index}.elements.${i}.value`,
          label: `${t('commonTypography.rate')} ${obj.name}`,
          colSpan: 6,
          withAsterisk: false,
          labelWithTranslate: false,
          key: `samples.${index}.elements.${i}.value.${val.id}`,
          disabled: true,
        });
        return elementInput;
      });
      const date = globalDate({
        name: `samples.${index}.date`,
        label: 'sampleDate2',
        withAsterisk: false,
        clearable: true,
        colSpan: 6,
        key: `samples.${index}.date.${val.id}`,
        disabled: true,
      });
      const sampleTypesItem = sampleTypeSelect({
        colSpan: 6,
        withAsterisk: false,
        label: 'sampleType2',
        name: `samples.${index}.sampleTypeId`,
        key: `samples.${index}.sampleTypeId.${val.id}`,
        disabled: true,
      });
      const sampleNumber = globalText({
        name: `samples.${index}.sampleNumber`,
        label: 'sampleNumber',
        colSpan: 12,
        withAsterisk: true,
        key: `samples.${index}.sampleNumber.${val.id}`,
        onChange: (e) => {
          setIndexOfSample(index);
          setSampleNumber(e.currentTarget.value);
          methods.setValue(
            `samples.${index}.sampleNumber`,
            e.currentTarget.value
          );
        },
      });
      const isDelete = methods.watch(
        `samples.${index}.isCreatedAfterDetermine`
      );

      const group: ControllerGroup = {
        group: t('commonTypography.sampleInformation'),
        enableGroupLabel: true,
        actionGroup: {
          deleteButton: {
            label: t('commonTypography.delete'),
            onClick: () => {
              remove(index);
            },
            disabled: isDetermination ? (isDelete ? false : true) : false,
          },
        },
        formControllers: [
          sampleNumber,
          sampleTypesItem,
          date,
          ...(elementItem ?? []),
        ],
      };

      return group;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sampleFields, isDetermination]
  );
  const sampleGroupItem = sampleFields.map(sampleGroup);

  const fieldItemStepOne = React.useMemo(() => {
    const stockpileNameItem = stockpileNameSelect({
      colSpan: 6,
      defaultValue: monitoringStockpileDetail?.dome?.stockpile.id,
      labelValue: monitoringStockpileDetail?.dome?.stockpile.name,
      disabled: true,
    });
    const domeNameItem = domeNameSelect({
      colSpan: 6,
      disabled: true,
      defaultValue: monitoringStockpileDetail?.dome?.id,
      labelValue: monitoringStockpileDetail?.dome?.name,
    });
    const domeIdItem = globalText({
      name: 'handbookId',
      label: 'domeId',
      colSpan: 6,
      disabled: true,
      withAsterisk: false,
    });
    const materialSubItem = materialSelect({
      colSpan: 6,
      name: 'oreSubMaterialId',
      label: 'materialType',
      withAsterisk: true,
      parentId: `${process.env.NEXT_PUBLIC_MATERIAL_ORE_ID}`,
      isHaveParent: null,
    });
    const openDateItem = globalDate({
      name: 'openDate',
      label: 'startOpen',
      withAsterisk: false,
      clearable: true,
      colSpan: 6,
      disabled: true,
    });
    const closeDateItem = globalDate({
      name: 'closeDate',
      label: 'endOpen',
      withAsterisk: false,
      clearable: true,
      colSpan: 6,
      disabled: true,
    });
    const openTimeItem = globalTimeInput({
      name: 'openTime',
      label: 'openTime',
      withAsterisk: false,
      colSpan: 6,
      disabled: true,
    });
    const closeTimeItem = globalTimeInput({
      name: 'closeTime',
      label: 'closeTime',
      withAsterisk: false,
      colSpan: 6,
      disabled: true,
    });
    const tonByRitageItem = globalNumberInput({
      colSpan: 12,
      name: 'tonByRitage',
      label: 'tonByRitage',
      withAsterisk: false,
      disabled: true,
    });
    const desc = globalText({
      colSpan: 12,
      name: 'desc',
      label: 'desc',
      withAsterisk: false,
    });
    const photo: ControllerProps = {
      control: 'image-dropzone',
      name: 'photo',
      label: 'photo',
      description: 'photoDescription',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      multiple: false,
      enableDeletePhoto: true,
      serverPhotos: serverPhoto,
      handleDeleteServerPhotos: () => {
        setServerPhoto([]);
      },
      onDrop: (value) => {
        methods.setValue('photo', value);
        methods.clearErrors('photo');
        setServerPhoto([]);
      },
      onReject: (files) =>
        handleRejectFile<IMutationStockpile>({
          methods,
          files,
          field: 'photo',
        }),
    };

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.stockpileInformation'),
        enableGroupLabel: true,
        formControllers: [
          stockpileNameItem,
          domeNameItem,
          domeIdItem,
          materialSubItem,
        ],
      },
      {
        group: t('commonTypography.time'),
        enableGroupLabel: true,
        actionOuterGroupBottom: {
          addButton: {
            label: t('commonTypography.createSurvey'),
            onClick: () => {
              appendSurveyFields({
                date: undefined,
                ton: '',
                volume: '',
              });
            },
          },
        },
        formControllers: [
          openDateItem,
          closeDateItem,
          openTimeItem,
          closeTimeItem,
        ],
      },
      ...surveyGroupItem,
      {
        group: t('commonTypography.tonByRitage'),
        formControllers: [tonByRitageItem],
      },
      {
        group: t('commonTypography.desc'),
        formControllers: [desc],
      },
      {
        group: t('commonTypography.documentation'),
        formControllers: [photo],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monitoringStockpileDetail, surveyGroupItem, serverPhoto]);

  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const nextStep = async () => {
    const fieldStepOneName: fieldName[] = [
      'closeDate',
      'closeTime',
      'domeId',
      'stockpileId',
      'handbookId',
      'desc',
      'openDate',
      'openTime',
      'oreSubMaterialId',
      'photo',
      'stockpileId',
      'tonSurveys',
    ];
    const output = await methods.trigger(fieldStepOneName, {
      shouldFocus: true,
    });

    if (!output) return;
    setActive((current) => (current < 2 ? current + 1 : current));
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmitForm: SubmitHandler<IMutationStockpile> = async (data) => {
    const values = objectToArrayValue(data);
    const dateValue = ['openDate', 'closeDate'];
    const manipulateValue = values.map((val) => {
      if (dateValue.includes(val.name)) {
        const date = dateToString(val.value);
        return {
          name: val.name,
          value: date,
        };
      }
      return {
        name: val.name,
        value: val.value,
      };
    });

    const dataSamples: IMutationUpdateSampleMonitoringStockpileValues[] =
      data.samples
        .filter((obj) => obj.isCreatedAfterDetermine)
        .map((val) => {
          const { sampleNumber } = val;
          return {
            sampleNumber,
          };
        });

    const deletePhoto = serverPhoto && serverPhoto.length === 0;

    if (isDetermination) {
      await executeUpdate({
        variables: {
          id,
          samples: dataSamples,
        },
      });
      return;
    }

    mutate({
      id,
      data: manipulateValue,
      deletePhoto,
    });
  };
  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={monitoringStockpileDetailLoading}>
      <SteperFormGroup
        active={isDetermination ? 1 : active}
        setActive={setActive}
        steps={[
          {
            name: 'Input Data Stockpile',
            fields: fieldItemStepOne,
            nextButton: { onClick: nextStep },
            backButton: {
              onClick: () =>
                router.push(
                  '/input-data/quality-control-management/stockpile-monitoring'
                ),
            },
          },
          {
            name: 'Input Data Sample',
            fields: sampleGroupItem,
            emptyStateProps: {
              title: 'Tidak Ada Data Sampel',
            },
            outerButton: {
              label: t('commonTypography.createSample'),
              onClick: () =>
                append({
                  date: undefined,
                  sampleTypeId: '',
                  sampleNumber: '',
                  isCreatedAfterDetermine: true,
                  elements: otherElements,
                }),
            },
            prevButton: isDetermination
              ? undefined
              : {
                  onClick: prevStep,
                },
            backButton: isDetermination
              ? {
                  onClick: () =>
                    router.push(
                      '/input-data/quality-control-management/stockpile-monitoring'
                    ),
                }
              : undefined,
            submitButton: {
              label: t('commonTypography.save'),
              type: 'button',
              onClick: async () => {
                const output = await methods.trigger(undefined, {
                  shouldFocus: true,
                });
                if (output) setIsOpenConfirmation((prev) => !prev);
              },
            },
          },
        ]}
        methods={methods}
        submitForm={handleSubmitForm}
        modalConfirmation={{
          isOpenModalConfirmation: isOpenConfirmation,
          actionModalConfirmation: () => setIsOpenConfirmation((prev) => !prev),
          actionButton: {
            label: t('commonTypography.yes'),
            type: 'button',
            onClick: handleConfirmation,
            loading: isDetermination ? loading : isLoading,
          },
          backButton: {
            label: 'Batal',
          },
          modalType: {
            type: 'default',
            title: t('commonTypography.alertTitleConfirmUpdate'),
          },
          withDivider: true,
        }}
      />
    </DashboardCard>
  );
};

export default UpdateStockpileMonitoringBook;
