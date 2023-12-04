import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import { useReadOneSampleHouseLab } from '@/services/graphql/query/sample-house-lab/useReadOneSampleHouseLab';
import {
  IElementRhf,
  IMutationSampleHousePlanValues,
} from '@/services/restapi/sample-house-plan/useCreateSampleHousePlan';
import { useUpdateSampleHousePlan } from '@/services/restapi/sample-house-plan/useUpdateSampleHousePlan';
import {
  employeeSelect,
  globalDate,
  globalNumberInput,
  globalText,
  globalTimeInput,
  locationCategorySelect,
  locationSelect,
  materialSelect,
} from '@/utils/constants/Field/global-field';
import {
  sampleTypeSelect,
  shiftSelect,
} from '@/utils/constants/Field/sample-house-field';
import { sampleHouseLabMutationValidation } from '@/utils/form-validation/sample-house-lab/sample-house-lab-mutation-validation';
import { formatDate2 } from '@/utils/helper/dateFormat';
import { dateToString, stringToDate } from '@/utils/helper/dateToString';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import { ControllerGroup, ControllerProps, IFile } from '@/types/global';

const UpdateSampleHouseLabPage = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [serverPhoto, setServerPhoto] = React.useState<
    Omit<IFile, 'mime' | 'path'>[] | null
  >([]);

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationSampleHousePlanValues>({
    resolver: zodResolver(sampleHouseLabMutationValidation),
    defaultValues: {
      laboratoriumName: '',
      sampleDate: undefined,
      shiftId: '',
      sampleNumber: '',
      sampleName: '',
      sampleTypeId: '',
      materialId: '',
      subMaterialId: '',
      samplerId: '',
      gradeControlId: '',
      locationCategoryId: '',
      locationId: '',
      locationName: '',
      sampleEnterLabDate: undefined,
      sampleEnterLabTime: '',
      gradeControlElements: [
        {
          elementId: '',
          name: '',
          value: '',
        },
      ],
      density: '',
      preparationStartDate: undefined,
      preparationStartTime: '',
      preparationFinishDate: undefined,
      preparationFinishTime: '',
      analysisStartDate: undefined,
      analysisStartTime: '',
      analysisFinishDate: undefined,
      analysisFinishTime: '',
      elements: [
        {
          elementId: '',
          name: '',
          value: '',
        },
      ],
      photo: [],
    },
    mode: 'onBlur',
  });
  const sampleTypeId = methods.watch('sampleTypeId');
  const materialId = methods.watch('materialId');
  const locationCategoryId = methods.watch('locationCategoryId');

  const { fields, replace } = useFieldArray({
    name: 'gradeControlElements',
    control: methods.control,
  });
  const { fields: fieldsElements, replace: replaceElements } = useFieldArray({
    name: 'elements',
    control: methods.control,
  });

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { elementsData, elementsDataLoading } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
    onCompleted: (data) => {
      const otherElements = data.elements.data.map((val) => {
        return {
          elementId: val.id,
          name: val.name,
          value: '',
        };
      });
      replace(otherElements);
      replaceElements(otherElements);
    },
  });

  const isOwnElemntsData =
    elementsData && elementsData.length > 0 ? true : false;

  const { houseSampleAndLab } = useReadOneSampleHouseLab({
    variables: {
      id,
    },
    skip: !router.isReady || !isOwnElemntsData,
    onCompleted: ({ houseSampleAndLab }) => {
      const isOwnSubMaterial = houseSampleAndLab.subMaterial !== null;
      fields.map((o, i) => {
        const valueGCElements = houseSampleAndLab?.gradeControlElements?.find(
          (val) => val.element?.id === o.elementId
        );
        const valueElements = houseSampleAndLab?.elements?.find(
          (val) => val.element?.id === o.elementId
        );
        methods.setValue(
          `gradeControlElements.${i}.value`,
          valueGCElements && valueGCElements.value
            ? `${valueGCElements.value}`
            : ''
        );
        methods.setValue(
          `elements.${i}.value`,
          valueElements && valueElements.value ? `${valueElements.value}` : ''
        );
      });
      const sampleDate = stringToDate(houseSampleAndLab.sampleDate ?? null);
      const sampleEnterLabDate = stringToDate(
        houseSampleAndLab.sampleEnterLabAt ?? null
      );
      const sampleEnterLabTime = formatDate2(
        houseSampleAndLab.sampleEnterLabAt,
        'HH:mm:ss'
      );
      const preparationStartDate = stringToDate(
        houseSampleAndLab.preparationStartAt ?? null
      );
      const preparationStartTime = formatDate2(
        houseSampleAndLab.preparationStartAt,
        'HH:mm:ss'
      );
      const preparationFinishDate = stringToDate(
        houseSampleAndLab.preparationFinishAt ?? null
      );
      const preparationFinishTime = formatDate2(
        houseSampleAndLab.preparationFinishAt,
        'HH:mm:ss'
      );
      const analysisStartDate = stringToDate(
        houseSampleAndLab.analysisStartAt ?? null
      );
      const analysisStartTime = formatDate2(
        houseSampleAndLab.analysisStartAt,
        'HH:mm:ss'
      );
      const analysisFinishDate = stringToDate(
        houseSampleAndLab.analysisFinishAt ?? null
      );
      const analysisFinishTime = formatDate2(
        houseSampleAndLab.analysisFinishAt,
        'HH:mm:ss'
      );

      methods.setValue('laboratoriumName', houseSampleAndLab.laboratoriumName);
      methods.setValue('sampleDate', sampleDate);
      methods.setValue('shiftId', houseSampleAndLab.shift?.id ?? '');
      methods.setValue('sampleNumber', houseSampleAndLab?.sampleNumber ?? '');
      methods.setValue('sampleName', houseSampleAndLab?.sampleName ?? '');
      methods.setValue('sampleTypeId', houseSampleAndLab?.sampleType?.id ?? '');
      methods.setValue('materialId', houseSampleAndLab.material?.id ?? '');
      if (isOwnSubMaterial) {
        methods.setValue(
          'subMaterialId',
          houseSampleAndLab.subMaterial?.id ?? ''
        );
      }
      methods.setValue('samplerId', houseSampleAndLab.sampler?.id ?? '');
      methods.setValue(
        'gradeControlId',
        houseSampleAndLab.gradeControl?.id ?? ''
      );
      methods.setValue(
        'locationCategoryId',
        houseSampleAndLab.locationCategory?.id ?? ''
      );
      methods.setValue('locationId', houseSampleAndLab.location?.id ?? '');
      methods.setValue('locationName', houseSampleAndLab.locationName ?? '');
      methods.setValue('sampleEnterLabDate', sampleEnterLabDate);
      methods.setValue('sampleEnterLabTime', sampleEnterLabTime ?? '');
      methods.setValue('density', houseSampleAndLab.density ?? '');
      methods.setValue('preparationStartDate', preparationStartDate);
      methods.setValue('preparationStartTime', preparationStartTime ?? '');
      methods.setValue('preparationFinishDate', preparationFinishDate);
      methods.setValue('preparationFinishTime', preparationFinishTime ?? '');
      methods.setValue('analysisStartDate', analysisStartDate);
      methods.setValue('analysisStartTime', analysisStartTime ?? '');
      methods.setValue('analysisFinishDate', analysisFinishDate);
      methods.setValue('analysisFinishTime', analysisFinishTime ?? '');
      if (houseSampleAndLab.photo) {
        setServerPhoto([houseSampleAndLab.photo]);
      }
    },
  });

  const { mutate, isLoading } = useUpdateSampleHousePlan({
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
          message: err.message,
          icon: <IconX />,
        });
      }
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('sampleHouseLab.successUpdateMessage'),
        icon: <IconCheck />,
      });
      router.push('/input-data/quality-control-management/sample-house-lab');
      methods.reset();
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */
  const fieldGradeControlElements = React.useCallback(
    (val: IElementRhf, index: number) => {
      const elementItem = globalText({
        name: `gradeControlElements.${index}.value`,
        label: `${val.name} ${t('commonTypography.estimationGC')}`,
        colSpan: 6,
        withAsterisk: false,
        labelWithTranslate: false,
      });

      return elementItem;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const fieldGradeControlElementsItem = fields.map(fieldGradeControlElements);

  const fieldElements = React.useCallback(
    (val: IElementRhf, index: number) => {
      const elementItem = globalText({
        name: `elements.${index}.value`,
        label: `${val.name} ${t('commonTypography.percentageLab')}`,
        colSpan: 6,
        withAsterisk: false,
        labelWithTranslate: false,
      });

      return elementItem;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const fieldElementsItem = fieldsElements.map(fieldElements);

  const fieldRhf = React.useMemo(() => {
    const sampleBulk = sampleTypeId === 'b778c4e0-6c98-42ac-a12f-c06ad56ea96e';

    const laboratoriumName = globalText({
      name: 'laboratoriumName',
      label: 'laboratoriumName',
      colSpan: 6,
    });
    const sampleDate = globalDate({
      name: 'sampleDate',
      label: 'sampleDate',
      withAsterisk: true,
      clearable: true,
      colSpan: 6,
    });
    const shiftItem = shiftSelect({
      colSpan: 6,
    });
    const sampleNumber = globalText({
      name: 'sampleNumber',
      label: 'sampleNumber',
      colSpan: 6,
    });
    const sampleName = globalText({
      name: 'sampleName',
      label: 'sampleName',
      colSpan: 6,
    });
    const sampleTypesItem = sampleTypeSelect({
      colSpan: 6,
      onChange: (value) => {
        methods.setValue('sampleTypeId', value ?? '');
        methods.setValue('materialId', '');
        methods.setValue('subMaterialId', '');
        methods.setValue('density', '');
        methods.trigger('sampleTypeId');
      },
    });
    const materialItem = materialSelect({
      colSpan: 6,
      name: 'materialId',
      label: 'categoryBulSampling',
      withAsterisk: true,
      disabled: !sampleBulk,
      includeIds: [
        `${process.env.NEXT_PUBLIC_MATERIAL_OB_ID}`,
        `${process.env.NEXT_PUBLIC_MATERIAL_ORE_ID}`,
      ],
      onChange: (value) => {
        methods.setValue('materialId', value ?? '');
        methods.setValue('subMaterialId', '');
        methods.trigger('materialId');
      },
    });
    const materialSubItem = materialSelect({
      colSpan: 6,
      name: 'subMaterialId',
      label: 'subCategoryBulSampling',
      withAsterisk: true,
      disabled: !sampleBulk,
      parentId: materialId,
      isHaveParent: null,
    });
    const employeeItem = employeeSelect({
      colSpan: 6,
      name: 'samplerId',
      label: 'samplerName',
      withAsterisk: false,
      defaultValue: houseSampleAndLab?.sampler?.id,
      labelValue: houseSampleAndLab?.sampler?.humanResource?.name,
    });
    const gradeControlItem = employeeSelect({
      colSpan: 6,
      name: 'gradeControlId',
      label: 'gcName',
      withAsterisk: false,
      defaultValue: houseSampleAndLab?.gradeControl?.id,
      labelValue: houseSampleAndLab?.gradeControl?.humanResource?.name,
    });
    const locationCategoryItem = locationCategorySelect({
      clearable: true,
      name: 'locationCategoryId',
    });
    const locationItem = locationSelect({
      colSpan: 6,
      name: 'locationId',
      label: 'locationName',
      withAsterisk: true,
      categoryId: locationCategoryId,
    });
    const location = globalText({
      name: 'locationName',
      label: 'locationName',
      colSpan: 6,
      withAsterisk: true,
    });
    const sampleEnterLabDate = globalDate({
      name: 'sampleEnterLabDate',
      label: 'sampleEnterLabDate',
      clearable: true,
      withAsterisk: true,
      colSpan: 6,
    });
    const sampleEnterLabTime = globalTimeInput({
      name: 'sampleEnterLabTime',
      label: 'sampleEnterLabTime',
      colSpan: 6,
      withAsterisk: true,
    });
    const density = globalNumberInput({
      name: 'density',
      label: 'densityBulkSampling',
      colSpan: 12,
      withAsterisk: true,
      precision: 3,
      disabled: !sampleBulk,
    });
    const preparationStartDate = globalDate({
      name: 'preparationStartDate',
      label: 'preparationStartDate',
      withAsterisk: false,
      clearable: true,
      colSpan: 6,
    });
    const preparationStartTime = globalTimeInput({
      name: 'preparationStartTime',
      label: 'preparationStartHour',
      colSpan: 6,
      withAsterisk: false,
    });
    const preparationFinishDate = globalDate({
      name: 'preparationFinishDate',
      label: 'preparationEndDate',
      clearable: true,
      withAsterisk: false,
      colSpan: 6,
    });
    const preparationFinishTime = globalTimeInput({
      name: 'preparationFinishTime',
      label: 'preparationEndHour',
      colSpan: 6,
      withAsterisk: false,
    });
    const analysisStartDate = globalDate({
      name: 'analysisStartDate',
      label: 'analysisStartDate',
      clearable: true,
      withAsterisk: false,
      colSpan: 6,
    });
    const analysisStartTime = globalTimeInput({
      name: 'analysisStartTime',
      label: 'analysisStartHour',
      colSpan: 6,
      withAsterisk: false,
    });
    const analysisFinishDate = globalDate({
      name: 'analysisFinishDate',
      label: 'analysisEndDate',
      withAsterisk: false,
      clearable: true,
      colSpan: 6,
    });
    const analysisFinishTime = globalTimeInput({
      name: 'analysisFinishTime',
      label: 'analysisEndHour',
      colSpan: 6,
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
      },
      onReject: (files) =>
        handleRejectFile<IMutationSampleHousePlanValues>({
          methods,
          files,
          field: 'photo',
        }),
    };

    const field: ControllerGroup[] = [
      {
        group: t('sampleHouseLab.qualityMaterialInformation'),
        enableGroupLabel: true,
        formControllers: [
          laboratoriumName,
          sampleDate,
          shiftItem,
          sampleNumber,
          sampleName,
          sampleTypesItem,
          materialItem,
          materialSubItem,
          employeeItem,
          gradeControlItem,
          locationCategoryItem,
          sampleEnterLabDate,
          sampleEnterLabTime,
        ],
      },
      {
        group: t('commonTypography.rate'),
        enableGroupLabel: true,
        formControllers: [...fieldGradeControlElementsItem],
      },
      {
        group: t('commonTypography.density'),
        formControllers: [density],
      },
      {
        group: t('commonTypography.preparationTime'),
        enableGroupLabel: true,
        formControllers: [
          preparationStartDate,
          preparationFinishDate,
          preparationStartTime,
          preparationFinishTime,
        ],
      },
      {
        group: t('commonTypography.analysisTime'),
        enableGroupLabel: true,
        formControllers: [
          analysisStartDate,
          analysisFinishDate,
          analysisStartTime,
          analysisFinishTime,
        ],
      },
      {
        group: t('commonTypography.rate'),
        enableGroupLabel: true,
        formControllers: [...fieldElementsItem],
      },
      {
        group: t('commonTypography.photo'),
        formControllers: [photo],
      },
    ];

    const newCategoryId = locationCategoryId === '' ? null : locationCategoryId;

    !newCategoryId
      ? field
      : newCategoryId === `${process.env.NEXT_PUBLIC_OTHER_LOCATION_ID}`
      ? field[0].formControllers.splice(11, 0, location)
      : field[0].formControllers.splice(11, 0, locationItem);

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sampleTypeId,
    fieldGradeControlElementsItem,
    fieldElementsItem,
    serverPhoto,
    materialId,
    locationCategoryId,
    houseSampleAndLab,
  ]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationSampleHousePlanValues> = (
    data
  ) => {
    methods.clearErrors('gradeControlElements');
    methods.clearErrors('elements');

    const values = objectToArrayValue(data);
    const dateValue = [
      'sampleDate',
      'sampleEnterLabDate',
      'preparationStartDate',
      'preparationFinishDate',
      'analysisStartDate',
      'analysisFinishDate',
    ];
    const numberValue = ['density'];

    const valuesWithDateString = values.map((val) => {
      if (dateValue.includes(val.name)) {
        const date = dateToString(val.value);
        return {
          name: val.name,
          value: date,
        };
      }
      if (numberValue.includes(val.name)) {
        return {
          name: val.name,
          value: `${val.value}`,
        };
      }
      return {
        name: val.name,
        value: val.value,
      };
    });
    const deletePhoto = serverPhoto && serverPhoto.length === 0;
    mutate({
      id,
      data: valuesWithDateString,
      deletePhoto,
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={elementsDataLoading}>
      <GlobalFormGroup
        field={fieldRhf}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: isLoading,
        }}
        backButton={{
          onClick: () =>
            router.push(
              '/input-data/quality-control-management/sample-house-lab'
            ),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateSampleHouseLabPage;
