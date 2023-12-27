import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, SteperFormGroup } from '@/components/elements';

import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import { useReadOneStockpileDomeMaster } from '@/services/graphql/query/stockpile-master/useReadOneStockpileDomeMaster';
import { useReadOneStockpileMonitoring } from '@/services/graphql/query/stockpile-monitoring/useReadOneStockpileMonitoring';
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
import { formatDate2 } from '@/utils/helper/dateFormat';
import { dateToString, stringToDate } from '@/utils/helper/dateToString';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
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

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationStockpile>({
    // resolver: zodResolver(stockpileMonitoringMutationValidation),
    defaultValues: {
      stockpileId: '',
      domeId: '',
      handbookId: '',
      oreSubMaterialId: '',
      openDate: undefined,
      openTime: '',
      closeDate: undefined,
      closeTime: '',
      tonSurveys: [
        {
          date: undefined,
          ton: '',
        },
      ],
      tonByRitage: '',
      bargingStartDate: undefined,
      bargingStartTime: '',
      bargingFinishDate: undefined,
      bargingFinishTime: '',
      movings: [
        {
          startDate: undefined,
          startTime: '',
          finishDate: undefined,
          finishTime: '',
        },
      ],
      reopens: [
        {
          openDate: undefined,
          openTime: '',
          closeDate: undefined,
          closeTime: '',
        },
      ],
      desc: '',
      samples: [
        {
          date: undefined,
          sampleTypeId: '',
          sampleNumber: '',
          elements: [
            {
              elementId: '',
              name: '',
              value: '',
            },
          ],
        },
      ],
      photo: [],
    },
    mode: 'onBlur',
  });
  const domeId = methods.watch('domeId');
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
  const { fields: movingFields, replace: replaceMovingFields } = useFieldArray({
    name: 'movings',
    control: methods.control,
  });
  const { fields: reopenFields, replace: replaceReopenFields } = useFieldArray({
    name: 'reopens',
    control: methods.control,
  });
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { elementsData } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
    onCompleted: (data) => {
      const other = data.elements.data.map((val) => {
        return {
          elementId: val.id,
          name: val.name,
          value: '',
        };
      });
      replace([
        {
          date: undefined,
          sampleTypeId: '',
          sampleNumber: '',
          elements: other,
        },
      ]);
      setOtherElements(other);
    },
  });
  useReadOneStockpileDomeMaster({
    variables: {
      id: domeId as string,
    },
    skip: domeId === '' || !domeId,
    onCompleted: (data) => {
      methods.setValue('handbookId', data.dome.handBookId);
    },
  });
  const { monitoringStockpile, monitoringStockpileLoading } =
    useReadOneStockpileMonitoring({
      variables: {
        id,
      },
      skip: !router.isReady,
      onCompleted: ({ monitoringStockpile }) => {
        sampleFields.map((o, index: number) => {
          o.elements.map((v, k) => {
            const element = monitoringStockpile.currentSample.elements.find(
              (val) => val.element.id === v.elementId
            );
            methods.setValue(
              `samples.${index}.elements.${k}.value`,
              element?.value ?? ''
            );
          });
          const date = stringToDate(
            monitoringStockpile.currentSample.date ?? null
          );
          methods.setValue(`samples.${index}.date`, date);
          methods.setValue(
            `samples.${index}.sampleTypeId`,
            monitoringStockpile.currentSample.sampleType.id ?? ''
          );
          methods.setValue(
            `samples.${index}.sampleNumber`,
            monitoringStockpile.currentSample.sampleNumber ?? ''
          );
        });
        const surveys = monitoringStockpile.tonSurveys?.map((val) => {
          const date = stringToDate(val.date ?? null);
          return {
            date: date,
            ton: val.ton ?? '',
          };
        });
        const movings = monitoringStockpile.movings?.map((val) => {
          const startDate = stringToDate(val.startAt ?? null);
          const startTime = formatDate2(val.startAt, 'HH:mm:ss');
          const finishDate = stringToDate(val.finishAt ?? null);
          const finishTime = formatDate2(val.finishAt, 'HH:mm:ss');
          return {
            startDate: startDate,
            startTime: startTime ?? '',
            finishDate: finishDate,
            finishTime: finishTime ?? '',
          };
        });
        const reopens = monitoringStockpile.reopens?.map((val) => {
          const openDate = stringToDate(val.openAt ?? null);
          const openTime = formatDate2(val.openAt, 'HH:mm:ss');
          const closeDate = stringToDate(val.closeAt ?? null);
          const closeTime = formatDate2(val.closeAt, 'HH:mm:ss');
          return {
            openDate: openDate,
            openTime: openTime ?? '',
            closeDate: closeDate,
            closeTime: closeTime ?? '',
          };
        });
        replaceSurveyFields(
          surveys && surveys.length > 0 ? surveys : { date: undefined, ton: '' }
        );
        replaceMovingFields(
          movings && movings.length > 0
            ? movings
            : {
                startDate: undefined,
                startTime: '',
                finishDate: undefined,
                finishTime: '',
              }
        );
        replaceReopenFields(
          reopens && reopens.length > 0
            ? reopens
            : {
                openDate: undefined,
                openTime: '',
                closeDate: undefined,
                closeTime: '',
              }
        );
        const openDate = stringToDate(monitoringStockpile.openAt ?? null);
        const closeDate = stringToDate(monitoringStockpile.closeAt ?? null);
        const openTime = formatDate2(monitoringStockpile.openAt, 'HH:mm:ss');
        const closeTime = formatDate2(monitoringStockpile.closeAt, 'HH:mm:ss');
        const bargingStartDate = stringToDate(
          monitoringStockpile.bargingStartAt ?? null
        );
        const bargingFinishDate = stringToDate(
          monitoringStockpile.bargingFinishAt ?? null
        );
        const bargingStartTime = formatDate2(
          monitoringStockpile.bargingStartAt,
          'HH:mm:ss'
        );
        const bargingFinishTime = formatDate2(
          monitoringStockpile.bargingFinishAt,
          'HH:mm:ss'
        );
        methods.setValue(
          'stockpileId',
          monitoringStockpile.dome?.stockpile.id ?? ''
        );
        methods.setValue('domeId', monitoringStockpile.dome?.id ?? '');
        methods.setValue(
          'oreSubMaterialId',
          monitoringStockpile.material?.id ?? ''
        );
        methods.setValue('openDate', openDate);
        methods.setValue('closeDate', closeDate);
        methods.setValue('openTime', openTime ?? '');
        methods.setValue('closeTime', closeTime ?? '');
        methods.setValue('tonByRitage', monitoringStockpile.tonByRitage ?? '');
        methods.setValue('bargingStartDate', bargingStartDate);
        methods.setValue('bargingFinishDate', bargingFinishDate);
        methods.setValue('bargingStartTime', bargingStartTime ?? '');
        methods.setValue('bargingFinishTime', bargingFinishTime ?? '');
        methods.setValue('desc', monitoringStockpile.desc ?? '');
        if (monitoringStockpile.photo) {
          setServerPhoto([monitoringStockpile.photo]);
        }
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
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */
  const surveyGroup = React.useCallback(
    (_, index: number) => {
      const surveyDateItem = globalDate({
        name: `tonSurveys.${index}.date`,
        label: 'surveyDate',
        withAsterisk: false,
        clearable: true,
        colSpan: 6,
        value: methods.watch(`tonSurveys.${index}.date`),
        onChange: (value) => {
          methods.setValue(`tonSurveys.${index}.date`, value);
        },
      });
      const ton = methods.watch(`tonSurveys.${index}.ton`);
      const tonBySurveyItem = globalNumberInput({
        colSpan: 6,
        name: `tonSurveys.${index}.ton`,
        label: 'tonBySurvey',
        withAsterisk: false,
        value: ton !== '' ? Number(ton) : '',
        onChange: (value) => {
          methods.setValue(`tonSurveys.${index}.ton`, value);
        },
      });

      const group: ControllerGroup = {
        group: t('commonTypography.survey'),
        enableGroupLabel: true,
        formControllers: [surveyDateItem, tonBySurveyItem],
        actionOuterGroup: {
          addButton:
            index === 0
              ? {
                  label: t('commonTypography.createSurvey'),
                  onClick: () => {
                    appendSurveyFields({
                      date: undefined,
                      ton: '',
                    });
                  },
                }
              : undefined,
        },
        actionGroup: {
          deleteButton: {
            label: t('commonTypography.delete'),
            onClick: () => {
              surveyFields.length > 1 ? removeSurveyFields(index) : null;
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

  const movingGroup = React.useCallback(
    (_, index: number) => {
      const movingStartDateItem = globalDate({
        name: `movings.${index}.startDate`,
        label: 'movingStartDate',
        value: methods.watch(`movings.${index}.startDate`),
        withAsterisk: false,
        clearable: true,
        colSpan: 6,
      });
      const movingFinishDateItem = globalDate({
        name: `movings.${index}.finishDate`,
        label: 'movingFinishDate',
        value: methods.watch(`movings.${index}.finishDate`),
        withAsterisk: false,
        clearable: true,
        colSpan: 6,
      });
      const movingStartTimeItem = globalTimeInput({
        name: `movings.${index}.startTime`,
        label: 'movingStartTime',
        value: methods.watch(`movings.${index}.startTime`),
        withAsterisk: false,
        colSpan: 6,
      });
      const movingFinishTimeItem = globalTimeInput({
        name: `movings.${index}.finishTime`,
        label: 'movingFinishTime',
        value: methods.watch(`movings.${index}.finishTime`),
        withAsterisk: false,
        colSpan: 6,
      });

      const group: ControllerGroup = {
        group: t('commonTypography.moving'),
        enableGroupLabel: true,
        formControllers: [
          movingStartDateItem,
          movingFinishDateItem,
          movingStartTimeItem,
          movingFinishTimeItem,
        ],
      };
      return group;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [movingFields]
  );
  const movingGroupItem = movingFields.map(movingGroup);
  const reopenGroup = React.useCallback(
    (_, index: number) => {
      const reopenStartDateItem = globalDate({
        name: `reopens.${index}.openDate`,
        label: 'reopenStartDate',
        value: methods.watch(`reopens.${index}.openDate`),
        withAsterisk: false,
        clearable: true,
        colSpan: 6,
      });
      const reopenFinishDateItem = globalDate({
        name: `reopens.${index}.closeDate`,
        label: 'reopenCloseDate',
        value: methods.watch(`reopens.${index}.closeDate`),
        withAsterisk: false,
        clearable: true,
        colSpan: 6,
      });
      const reopenStartTimeItem = globalTimeInput({
        name: `reopens.${index}.openTime`,
        label: 'reopenStartTime',
        value: methods.watch(`reopens.${index}.openTime`),
        withAsterisk: false,
        colSpan: 6,
      });
      const reopenFinishTimeItem = globalTimeInput({
        name: `reopens.${index}.closeTime`,
        label: 'reopenCloseTime',
        value: methods.watch(`reopens.${index}.closeTime`),
        withAsterisk: false,
        colSpan: 6,
      });

      const group: ControllerGroup = {
        group: t('commonTypography.reopen'),
        enableGroupLabel: true,
        formControllers: [
          reopenStartDateItem,
          reopenFinishDateItem,
          reopenStartTimeItem,
          reopenFinishTimeItem,
        ],
      };
      return group;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reopenFields]
  );
  const reopenGroupItem = reopenFields.map(reopenGroup);

  const fieldItemStepOne = React.useMemo(() => {
    const stockpileNameItem = stockpileNameSelect({
      colSpan: 6,
      onChange: (value) => {
        methods.setValue('stockpileId', value ?? '');
        methods.setValue('domeId', '');
        methods.setValue('handbookId', '');
      },
    });
    const domeNameItem = domeNameSelect({
      colSpan: 6,
      onChange: (value) => {
        methods.clearErrors('domeId');
        methods.setValue('domeId', value ?? '');
        methods.setValue('handbookId', '');
      },
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
      withAsterisk: true,
      clearable: true,
      colSpan: 6,
    });
    const closeDateItem = globalDate({
      name: 'closeDate',
      label: 'endOpen',
      withAsterisk: false,
      clearable: true,
      colSpan: 6,
    });
    const openTimeItem = globalTimeInput({
      name: 'openTime',
      label: 'openTime',
      withAsterisk: false,
      colSpan: 6,
    });
    const closeTimeItem = globalTimeInput({
      name: 'closeTime',
      label: 'closeTime',
      withAsterisk: false,
      colSpan: 6,
    });
    const tonByRitageItem = globalNumberInput({
      colSpan: 12,
      name: 'tonByRitage',
      label: 'tonByRitage',
      withAsterisk: false,
      disabled: true,
    });
    const bargingStartDateItem = globalDate({
      name: 'bargingStartDate',
      label: 'bargingStartDate',
      withAsterisk: false,
      clearable: true,
      colSpan: 6,
    });
    const bargingFinishDateItem = globalDate({
      name: 'bargingFinishDate',
      label: 'bargingFinishDate',
      withAsterisk: false,
      clearable: true,
      colSpan: 6,
    });
    const bargingStartTimeItem = globalTimeInput({
      name: 'bargingStartTime',
      label: 'bargingStartTime',
      withAsterisk: false,
      colSpan: 6,
    });
    const bargingFinishTimeItem = globalTimeInput({
      name: 'bargingFinishTime',
      label: 'bargingFinishTime',
      withAsterisk: false,
      colSpan: 6,
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
        group: t('commonTypography.barging'),
        enableGroupLabel: true,
        formControllers: [
          bargingStartDateItem,
          bargingFinishDateItem,
          bargingStartTimeItem,
          bargingFinishTimeItem,
        ],
      },
      ...movingGroupItem,
      ...reopenGroupItem,
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
  }, [
    monitoringStockpile,
    surveyGroupItem,
    movingGroupItem,
    reopenGroupItem,
    serverPhoto,
  ]);

  const fieldItemStepTwo = React.useMemo(
    () => {
      const fieldArray = sampleFields.map((_, index: number) => {
        const elementItem = elementsData?.map((val, i) => {
          const elementInput = globalNumberInput({
            name: `samples.${index}.elements.${i}.value`,
            label: `${t('commonTypography.rate')} ${val.name}`,
            colSpan: 6,
            withAsterisk: false,
            labelWithTranslate: false,
            onChange: (value) => {
              methods.setValue(`samples.${index}.elements.${i}.value`, value);
            },
          });

          return elementInput;
        });
        const date = globalDate({
          name: `samples.${index}.date`,
          label: 'sampleDate2',
          withAsterisk: false,
          clearable: true,
          colSpan: 12,
        });
        const sampleTypesItem = sampleTypeSelect({
          colSpan: 6,
          withAsterisk: false,
          label: 'sampleType2',
          name: `samples.${index}.sampleTypeId`,
        });
        const sampleNumber = globalText({
          name: `samples.${index}.sampleNumber`,
          label: 'sampleNumber',
          colSpan: 6,
          withAsterisk: false,
        });

        const field: ControllerGroup = {
          group: t('commonTypography.sampleInformation'),
          enableGroupLabel: true,
          actionGroup: {
            deleteButton: {
              label: t('commonTypography.delete'),
              onClick: () => {
                sampleFields.length > 1 ? remove(index) : null;
              },
            },
          },
          actionOuterGroup: {
            addButton:
              index === 0
                ? {
                    label: t('commonTypography.createSample'),
                    onClick: () =>
                      append({
                        date: undefined,
                        sampleTypeId: '',
                        sampleNumber: '',
                        elements: otherElements,
                      }),
                  }
                : undefined,
          },
          formControllers: [
            date,
            sampleTypesItem,
            sampleNumber,
            ...(elementItem ?? []),
          ],
        };
        return field;
      });
      return fieldArray;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sampleFields, elementsData, otherElements]
  );
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const nextStep = async () => {
    const fieldStepOneName: fieldName[] = [
      'closeDate',
      'closeTime',
      'domeId',
      'handbookId',
      'desc',
      'openDate',
      'openTime',
      'oreSubMaterialId',
      'photo',
      'stockpileId',
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
    const dateValue = [
      'openDate',
      'closeDate',
      'bargingStartDate',
      'bargingFinishDate',
    ];
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
    mutate({
      id,
      data: manipulateValue,
    });
  };
  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={monitoringStockpileLoading}>
      <SteperFormGroup
        active={active}
        setActive={setActive}
        steps={[
          {
            name: 'Input Data Stockpile',
            fields: fieldItemStepOne,
            nextButton: { onClick: nextStep },
            backButton: {
              onClick: () => router.back(),
            },
          },
          {
            name: 'Input Data Sample',
            fields: fieldItemStepTwo,
            prevButton: {
              onClick: prevStep,
            },
            submitButton: {
              label: t('commonTypography.save'),
              type: 'button',
              onClick: () => setIsOpenConfirmation((prev) => !prev),
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
            loading: isLoading,
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
