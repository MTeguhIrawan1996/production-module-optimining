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
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import { ControllerGroup, ControllerProps, IElementRhf } from '@/types/global';

type fieldName = keyof IMutationStockpileStepOne;

const UpdateStockpileMonitoringBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [active, setActive] = React.useState(0);
  const [otherElements, setOtherElements] = React.useState<IElementRhf[]>([]);

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
        const surveys = monitoringStockpile.tonSurveys?.map((val) => {
          const date = stringToDate(val.date ?? null);
          return {
            date: date,
            ton: `${val.ton ?? ''}`,
          };
        });
        replaceSurveyFields(
          surveys && surveys.length > 0 ? surveys : { date: undefined, ton: '' }
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
        // setServerPhotos(quarryRitage.photos ?? []);
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
      withAsterisk: true,
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
      onDrop: (value) => {
        methods.setValue('photo', value);
        methods.clearErrors('photo');
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
  }, [monitoringStockpile, surveyGroupItem]);

  const fieldItemStepTwo = React.useMemo(
    () => {
      const fieldArray = sampleFields.map((_, index: number) => {
        const elementItem = elementsData?.map((val, i) => {
          const elementInput = globalText({
            name: `samples.${index}.elements.${i}.value`,
            label: `${t('commonTypography.rate')} ${
              val.name
            } samples.${index}.elements.${i}.value`,
            colSpan: 6,
            withAsterisk: false,
            labelWithTranslate: false,
            onChange: (e) => {
              methods.setValue(
                `samples.${index}.elements.${i}.value`,
                e.currentTarget.value
              );
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
          group: t('commonTypography.dome'),
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

  // eslint-disable-next-line unused-imports/no-unused-vars
  const handleSubmitForm: SubmitHandler<IMutationStockpile> = async (data) => {
    const values = objectToArrayValue(data);
    const dateValue = ['openDate', 'closeDate'];
    // eslint-disable-next-line unused-imports/no-unused-vars
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

    // await executeCreate({
    //   variables: {
    //     name: data.name,
    //     startHour: data.startHour,
    //     endHour: data.endHour,
    //   },
    // });
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
              // loading: isLoading,
            },

            // nextButton: { onClick: () => console.log('next') },
            // backButton: {
            //   label: t('commonTypography.prev'),
            //   onClick: () => console.log('prev'),
            // },
          },
        ]}
        methods={methods}
        submitForm={handleSubmitForm}
      />
    </DashboardCard>
  );
};

export default UpdateStockpileMonitoringBook;
