import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  ICreateHeavyEquipmentMasterValues,
  useCreateHeavyEquipmentMaster,
} from '@/services/restapi/heavy-equipment/useCreateHeavyEquipmentMaster';
import {
  employeeSelect,
  globalDate,
  globalText,
  globalTimeInput,
  materialSelect,
} from '@/utils/constants/Field/global-field';
import {
  sampleTypeSelect,
  shiftSelect,
} from '@/utils/constants/Field/sample-house-field';
import { createHeavyEquipmentMasterSchema } from '@/utils/form-validation/master-heavy-equipment/heavy-equipment-validation';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import { ControllerGroup, ControllerProps } from '@/types/global';

const CreateSmapleHouseLabBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();

  /* #   /**=========== Methods =========== */
  const methods = useForm<any>({
    resolver: zodResolver(createHeavyEquipmentMasterSchema),
    defaultValues: {
      laboratoriumName: '',
      sampleDate: undefined,
      shiftId: '',
      sampleNumber: '',
      sampleName: '',
      sampleTypeId: '',
      subMaterialId: '',
      samplerId: '',
      gradeControlId: '',
      location: '',
      sampleEnterLabDate: undefined,
      sampleEnterLabTime: '',
      gradeControlElements: [
        {
          elementId: '',
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
          value: '',
        },
      ],
      photo: [],
    },
    mode: 'onBlur',
  });

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */

  const { mutate, isLoading } = useCreateHeavyEquipmentMaster({
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
        message: t('heavyEquipment.successCreateMasterMessage'),
        icon: <IconCheck />,
      });
      router.push('/master-data/heavy-equipment');
      methods.reset();
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */
  const fieldCreateHeavyEquipment = React.useMemo(() => {
    const laboratoriumName = globalText({
      name: 'laboratoriumName',
      label: 'laboratoriumName',
      colSpan: 6,
    });
    const sampleDate = globalDate({
      name: 'sampleDate',
      label: 'sampleDate',
      withAsterisk: true,
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
    });
    const materialItem = materialSelect({
      colSpan: 6,
      name: 'materialId',
      label: 'categoryBulSampling',
      withAsterisk: true,
    });
    const materialSubItem = materialSelect({
      colSpan: 6,
      name: 'subMaterialId',
      label: 'subCategoryBulSampling',
      withAsterisk: true,
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
    const location = globalText({
      name: 'location',
      label: 'location',
      colSpan: 6,
    });
    const sampleEnterLabDate = globalDate({
      name: 'sampleEnterLabDate',
      label: 'sampleEnterLabDate',
      withAsterisk: true,
      colSpan: 6,
    });
    const sampleEnterLabTime = globalTimeInput({
      name: 'sampleEnterLabTime',
      label: 'sampleEnterLabTime',
      colSpan: 6,
      withAsterisk: true,
    });

    const vehicleNumberPhoto: ControllerProps = {
      control: 'image-dropzone',
      name: 'vehicleNumberPhoto',
      label: 'vehicleDocument',
      description: 'photoDescription',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      multiple: false,
      enableDeletePhoto: true,
      onDrop: (value) => {
        methods.setValue('vehicleNumberPhoto', value);
        methods.clearErrors('vehicleNumberPhoto');
      },
      onReject: (files) =>
        handleRejectFile<ICreateHeavyEquipmentMasterValues>({
          methods,
          files,
          field: 'vehicleNumberPhoto',
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
          location,
          sampleEnterLabDate,
          sampleEnterLabTime,
        ],
      },
      {
        group: t('commonTypography.document'),
        enableGroupLabel: true,
        formControllers: [vehicleNumberPhoto],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<ICreateHeavyEquipmentMasterValues> = (
    data
  ) => {
    const values = objectToArrayValue(data);
    mutate({
      data: values,
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0}>
      <GlobalFormGroup
        field={fieldCreateHeavyEquipment}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: isLoading,
        }}
        backButton={{
          onClick: () => router.back(),
        }}
      />
    </DashboardCard>
  );
};

export default CreateSmapleHouseLabBook;
