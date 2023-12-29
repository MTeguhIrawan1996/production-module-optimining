import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import {
  IMutationSampleHousePlanValues,
  useCreateSampleHousePlan,
} from '@/services/restapi/sample-house-plan/useCreateSampleHousePlan';
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
import { dateToString } from '@/utils/helper/dateToString';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import { ControllerGroup, ControllerProps } from '@/types/global';

const CreateSmapleHouseLabBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();

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
  const locationCategoryId = methods.watch('locationCategoryId');
  const sampleTypeId = methods.watch('sampleTypeId');
  const materialId = methods.watch('materialId');

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
  const { elementsDataLoading } = useReadAllElementMaster({
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

  const { mutate, isLoading } = useCreateSampleHousePlan({
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
        message: t('sampleHouseLab.successCreateMessage'),
        icon: <IconCheck />,
      });
      router.push('/input-data/quality-control-management/sample-house-lab');
      methods.reset();
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */

  const fieldGradeControlElements = React.useCallback(
    (val, index: number) => {
      const elementItem = globalNumberInput({
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
    (val, index: number) => {
      const elementItem = globalNumberInput({
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
    });
    const gradeControlItem = employeeSelect({
      colSpan: 6,
      name: 'gradeControlId',
      label: 'gcName',
      withAsterisk: false,
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
    materialId,
    locationCategoryId,
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

    mutate({
      data: valuesWithDateString,
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

export default CreateSmapleHouseLabBook;
