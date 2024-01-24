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
import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import { useReadOneSampleHouseLabByNumberSample } from '@/services/graphql/query/sample-house-lab/useReadOneSampleHouseLabByNoSample';
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
import { stockpileMonitoringMutationValidation } from '@/utils/form-validation/stockpile-monitoring/stockpile-monitoring-validation';
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
      tonSurveys: [
        {
          date: undefined,
          ton: '',
        },
      ],
      tonByRitage: '',
      bargings: [
        {
          startDate: undefined,
          startTime: '',
          finishDate: undefined,
          finishTime: '',
        },
      ],

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
          isCreatedAfterDetermine: false,
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
  const { fields: bargingFields, replace: replaceBargingFields } =
    useFieldArray({
      name: 'bargings',
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

  const isOwnElemntsData =
    elementsData && elementsData.length > 0 ? true : false;

  const { monitoringStockpile, monitoringStockpileLoading } =
    useReadOneStockpileMonitoring({
      variables: {
        id,
      },
      skip: !router.isReady || !isOwnElemntsData,
      onCompleted: ({ monitoringStockpile }) => {
        const samples = monitoringStockpile.samples.map((val) => {
          const elemntsValue = elementsData?.map((o) => {
            const value = val.sample?.elements.find(
              (obj) => obj.element.id === o.id
            );
            return {
              elementId: o.id,
              name: o.name ?? '',
              value: value?.value ?? '',
            };
          });
          return {
            date: stringToDate(val.sample?.sampleDate ?? null),
            sampleTypeId: val.sample?.sampleType.id ?? '',
            sampleNumber: val.sampleNumber ?? '',
            isCreatedAfterDetermine: val.isCreatedAfterDetermine ? true : false,
            elements: elemntsValue ?? [],
          };
        });
        const initialSamples = {
          date: undefined,
          sampleTypeId: '',
          sampleNumber: '',
          isCreatedAfterDetermine: false,
          elements: otherElements,
        };
        samples.length > 0 ? replace(samples) : replace(initialSamples);

        const surveys = monitoringStockpile.tonSurveys?.map((val) => {
          const date = stringToDate(val.date ?? null);
          return {
            date: date,
            ton: val.ton ?? '',
          };
        });
        const movings = monitoringStockpile.movings?.map((val) => {
          const startDate = stringToDate(val.startAt ?? null);
          const startTime = formatDate(val.startAt, 'HH:mm:ss');
          const finishDate = stringToDate(val.finishAt ?? null);
          const finishTime = formatDate(val.finishAt, 'HH:mm:ss');
          return {
            startDate: startDate,
            startTime: startTime ?? '',
            finishDate: finishDate,
            finishTime: finishTime ?? '',
          };
        });
        const bargings = monitoringStockpile.bargings?.map((val) => {
          const startDate = stringToDate(val.startAt ?? null);
          const startTime = formatDate(val.startAt, 'HH:mm:ss');
          const finishDate = stringToDate(val.finishAt ?? null);
          const finishTime = formatDate(val.finishAt, 'HH:mm:ss');
          return {
            startDate: startDate,
            startTime: startTime ?? '',
            finishDate: finishDate,
            finishTime: finishTime ?? '',
          };
        });
        const reopens = monitoringStockpile.reopens?.map((val) => {
          const openDate = stringToDate(val.openAt ?? null);
          const openTime = formatDate(val.openAt, 'HH:mm:ss');
          const closeDate = stringToDate(val.closeAt ?? null);
          const closeTime = formatDate(val.closeAt, 'HH:mm:ss');
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
        replaceBargingFields(
          bargings && bargings.length > 0
            ? bargings
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
        const openTime = formatDate(monitoringStockpile.openAt, 'HH:mm:ss');
        const closeTime = formatDate(monitoringStockpile.closeAt, 'HH:mm:ss');
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
        methods.setValue('desc', monitoringStockpile.desc ?? '');
        if (monitoringStockpile.photo) {
          setServerPhoto([monitoringStockpile.photo]);
        }
      },
    });

  useReadOneSampleHouseLabByNumberSample({
    variables: {
      sampleNumber: sampleNumber,
      index: indexOfSample,
    },
    skip: indexOfSample === null || !isOwnElemntsData,
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

  const [executeUpdate, { loading }] = useUpdateSampleStockpileMonitoring({
    onCompleted: () => {
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
    monitoringStockpile?.status?.id ===
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

  const bargingGroup = React.useCallback(
    (
      val: FieldArrayWithId<IMutationStockpile, 'bargings', 'id'>,
      index: number
    ) => {
      const bargingStartDateItem = globalDate({
        name: `bargings.${index}.startDate`,
        label: 'bargingStartDate',
        withAsterisk: false,
        clearable: true,
        colSpan: 6,
        key: `bargings.${index}.startDate.${val.id}`,
        disabled: true,
      });
      const bargingFinishDateItem = globalDate({
        name: `bargings.${index}.finishDate`,
        label: 'bargingFinishDate',
        withAsterisk: false,
        clearable: true,
        colSpan: 6,
        key: `bargings.${index}.finishDate.${val.id}`,
        disabled: true,
      });
      const bargingStartTimeItem = globalTimeInput({
        name: `bargings.${index}.startTime`,
        label: 'bargingStartTime',
        withAsterisk: false,
        colSpan: 6,
        key: `bargings.${index}.startTime.${val.id}`,
        disabled: true,
      });
      const bargingFinishTimeItem = globalTimeInput({
        name: `bargings.${index}.finishTime`,
        label: 'bargingFinishTime',
        withAsterisk: false,
        colSpan: 6,
        key: `bargings.${index}.finishTime.${val.id}`,
        disabled: true,
      });

      const group: ControllerGroup = {
        group: t('commonTypography.barging'),
        enableGroupLabel: true,
        formControllers: [
          bargingStartDateItem,
          bargingFinishDateItem,
          bargingStartTimeItem,
          bargingFinishTimeItem,
        ],
      };
      return group;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const bargingGroupItem = bargingFields.map(bargingGroup);

  const movingGroup = React.useCallback(
    (
      val: FieldArrayWithId<IMutationStockpile, 'movings', 'id'>,
      index: number
    ) => {
      const movingStartDateItem = globalDate({
        name: `movings.${index}.startDate`,
        label: 'movingStartDate',
        withAsterisk: false,
        clearable: true,
        colSpan: 6,
        key: `movings.${index}.startDate.${val.id}`,
        disabled: true,
      });
      const movingFinishDateItem = globalDate({
        name: `movings.${index}.finishDate`,
        label: 'movingFinishDate',
        withAsterisk: false,
        clearable: true,
        colSpan: 6,
        key: `movings.${index}.finishDate.${val.id}`,
        disabled: true,
      });
      const movingStartTimeItem = globalTimeInput({
        name: `movings.${index}.startTime`,
        label: 'movingStartTime',
        withAsterisk: false,
        colSpan: 6,
        key: `movings.${index}.startTime.${val.id}`,
        disabled: true,
      });
      const movingFinishTimeItem = globalTimeInput({
        name: `movings.${index}.finishTime`,
        label: 'movingFinishTime',
        withAsterisk: false,
        colSpan: 6,
        key: `movings.${index}.finishTime.${val.id}`,
        disabled: true,
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
    []
  );
  const movingGroupItem = movingFields.map(movingGroup);

  const reopenGroup = React.useCallback(
    (
      val: FieldArrayWithId<IMutationStockpile, 'reopens', 'id'>,
      index: number
    ) => {
      const reopenStartDateItem = globalDate({
        name: `reopens.${index}.openDate`,
        label: 'reopenStartDate',
        withAsterisk: false,
        clearable: true,
        colSpan: 6,
        key: `reopens.${index}.openDate.${val.id}`,
        disabled: true,
      });
      const reopenFinishDateItem = globalDate({
        name: `reopens.${index}.closeDate`,
        label: 'reopenCloseDate',
        withAsterisk: false,
        clearable: true,
        colSpan: 6,
        key: `reopens.${index}.closeDate.${val.id}`,
        disabled: true,
      });
      const reopenStartTimeItem = globalTimeInput({
        name: `reopens.${index}.openTime`,
        label: 'reopenStartTime',
        withAsterisk: false,
        colSpan: 6,
        key: `reopens.${index}.openTime.${val.id}`,
        disabled: true,
      });
      const reopenFinishTimeItem = globalTimeInput({
        name: `reopens.${index}.closeTime`,
        label: 'reopenCloseTime',
        withAsterisk: false,
        colSpan: 6,
        key: `reopens.${index}.closeTime.${val.id}`,
        disabled: true,
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
    []
  );
  const reopenGroupItem = reopenFields.map(reopenGroup);

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
        withAsterisk: false,
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
              sampleFields.length > 1 ? remove(index) : null;
            },
            disabled: isDetermination ? (isDelete ? false : true) : false,
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
                      isCreatedAfterDetermine: true,
                      elements: otherElements,
                    }),
                }
              : undefined,
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
    [sampleFields, isDetermination, indexOfSample]
  );
  const sampleGroupItem = sampleFields.map(sampleGroup);

  const fieldItemStepOne = React.useMemo(() => {
    const stockpileNameItem = stockpileNameSelect({
      colSpan: 6,
      defaultValue: monitoringStockpile?.dome?.stockpile.id,
      labelValue: monitoringStockpile?.dome?.stockpile.name,
      disabled: true,
    });
    const domeNameItem = domeNameSelect({
      colSpan: 6,
      disabled: true,
      defaultValue: monitoringStockpile?.dome?.id,
      labelValue: monitoringStockpile?.dome?.name,
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
      ...bargingGroupItem,
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
    bargingGroupItem,
    movingGroupItem,
    reopenGroupItem,
    serverPhoto,
  ]);

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

    const dataSamples: IMutationUpdateSampleMonitoringStockpileValues[] =
      data.samples.map((val) => {
        // eslint-disable-next-line unused-imports/no-unused-vars
        const { isCreatedAfterDetermine, date, elements, ...rest } = val;
        const dateString = dateToString(date ?? null);
        const elementsManipulate = elements
          .filter((v) => v.value !== '')
          .map((obj) => {
            // eslint-disable-next-line unused-imports/no-unused-vars
            const { name, ...restElement } = obj;
            return {
              ...restElement,
            };
          });
        return {
          ...rest,
          date: dateString,
          elements: elementsManipulate,
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
    <DashboardCard p={0} isLoading={monitoringStockpileLoading}>
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
