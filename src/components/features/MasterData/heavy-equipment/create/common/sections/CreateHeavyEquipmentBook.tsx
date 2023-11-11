import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
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
  brandSelect,
  classSelect,
  eligibilityStatusSelect,
  globalText,
  modelSelect,
  typeSelect,
} from '@/utils/constants/Field/global-field';
import { createHeavyEquipmentMasterSchema } from '@/utils/form-validation/master-heavy-equipment/heavy-equipment-validation';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import { ControllerGroup, ControllerProps } from '@/types/global';

const CreateHeavyEquipmentMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();

  /* #   /**=========== Methods =========== */
  const methods = useForm<ICreateHeavyEquipmentMasterValues>({
    resolver: zodResolver(createHeavyEquipmentMasterSchema),
    defaultValues: {
      photos: [],
      brandId: '',
      chassisNumber: '',
      referenceId: '',
      typeId: '',
      specification: '',
      classId: '',
      createdYear: '',
      eligibilityStatusId: '',
      engineNumber: '',
      vehicleNumber: '',
      vehicleNumberPhoto: [],
    },
    mode: 'onBlur',
  });
  const brandId = methods.watch('brandId');
  const typeId = methods.watch('typeId');
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */

  const { mutate, isLoading } = useCreateHeavyEquipmentMaster({
    onError: (err) => {
      if (err.response) {
        const errorArry = errorRestBadRequestField(err);
        errorArry?.forEach(({ name, type, message }) => {
          methods.setError(name, { type, message });
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
    const engineNumber = globalText({
      name: `engineNumber`,
      label: 'engineNumber',
      colSpan: 6,
    });
    const frameNumber = globalText({
      name: 'chassisNumber',
      label: 'frameNumber',
      colSpan: 6,
    });
    const specification = globalText({
      name: 'specification',
      label: 'specHeavyEquipment',
      colSpan: 6,
      withAsterisk: false,
    });
    const createdYear = globalText({
      name: 'createdYear',
      label: 'productionYear',
      colSpan: 6,
    });
    const vehicleNumber = globalText({
      name: 'vehicleNumber',
      label: 'vehicleNumberOrRegirstrationNumber',
      colSpan: 6,
      withAsterisk: false,
    });
    const brandItem = brandSelect({
      label: 'brandHeavyEquipment',
      onChange: (value) => {
        methods.setValue('brandId', value ?? '');
        methods.setValue('typeId', '');
        methods.setValue('referenceId', '');
        methods.trigger('brandId');
      },
    });
    const typeItem = typeSelect({
      label: 'typeHeavyEquipment',
      brandId,
      onChange: (value) => {
        methods.setValue('typeId', value ?? '');
        methods.setValue('referenceId', '');
        methods.trigger('typeId');
      },
    });
    const modelItem = modelSelect({
      label: 'modelHeavyEquipment',
      name: 'referenceId',
      brandId,
      typeId,
      onChange: (value) => {
        methods.setValue('referenceId', value ?? '');
        methods.trigger('referenceId');
      },
    });
    const classItem = classSelect({
      label: 'class',
    });
    const eligibilityStatusItem = eligibilityStatusSelect({});

    const vehicleNumberPhoto: ControllerProps = {
      control: 'image-dropzone',
      name: 'vehicleNumberPhoto',
      label: 'vehicleDocument',
      description: 'photoDescription',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      multiple: true,
      maxFiles: 5,
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
    const imageInput: ControllerProps = {
      control: 'image-dropzone',
      name: 'photos',
      label: 'photo',
      description: 'photoDescription5',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      multiple: true,
      maxFiles: 5,
      enableDeletePhoto: true,
      onDrop: (value) => {
        methods.setValue('photos', value);
        methods.clearErrors('photos');
      },
      onReject: (files) =>
        handleRejectFile<ICreateHeavyEquipmentMasterValues>({
          methods,
          files,
          field: 'photos',
        }),
    };
    const field: ControllerGroup[] = [
      {
        group: t('heavyEquipment.informationHeavyEquipmentMaster'),
        enableGroupLabel: true,
        formControllers: [
          engineNumber,
          frameNumber,
          brandItem,
          typeItem,
          modelItem,
          specification,
          createdYear,
          classItem,
          eligibilityStatusItem,
          vehicleNumber,
        ],
      },
      {
        group: t('commonTypography.document'),
        enableGroupLabel: true,
        formControllers: [vehicleNumberPhoto, imageInput],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId, typeId]);
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

export default CreateHeavyEquipmentMasterBook;
