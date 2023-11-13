import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  ICreateHeavyEquipmentValues,
  useCreateHeavyEquipment,
} from '@/services/restapi/heavy-equipment/useCreateHeavyEquipment';
import { brandSelect, typeSelect } from '@/utils/constants/Field/global-field';
import { createHeavyEquipmentSchema } from '@/utils/form-validation/reference-heavy-equipment/heavy-equipment-validation';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';

import { ControllerGroup, ControllerProps } from '@/types/global';

const CreateHeavyEquipmentBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();

  /* #   /**=========== Methods =========== */
  const methods = useForm<ICreateHeavyEquipmentValues>({
    resolver: zodResolver(createHeavyEquipmentSchema),
    defaultValues: {
      photos: [],
      brandId: '',
      modelYear: '',
      typeId: '',
      spec: '',
      modelName: '',
    },
    mode: 'onBlur',
  });
  const brandId = methods.watch('brandId');
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { mutate, isLoading } = useCreateHeavyEquipment({
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
        message: t('heavyEquipment.successCreateMessage'),
        icon: <IconCheck />,
      });
      router.push('/reference/heavy-equipment');
      methods.reset();
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #endregion  /**======== FilterData =========== */

  /* #   /**=========== Field =========== */
  const fieldCreateHeavyEquipment = React.useMemo(() => {
    const brandItem = brandSelect({
      label: 'brandHeavyEquipment',
      onChange: (value) => {
        methods.setValue('brandId', value ?? '');
        methods.setValue('typeId', '');
        methods.trigger('brandId');
      },
    });
    const typeItem = typeSelect({
      label: 'typeHeavyEquipment',
      brandId,
      onChange: (value) => {
        methods.setValue('typeId', value ?? '');
        methods.trigger('typeId');
      },
    });
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
        handleRejectFile<ICreateHeavyEquipmentValues>({
          methods,
          files,
          field: 'photos',
        }),
    };
    const field: ControllerGroup[] = [
      {
        group: t('heavyEquipment.detailReference'),
        enableGroupLabel: true,
        formControllers: [
          brandItem,
          typeItem,
          {
            control: 'text-input',
            name: 'modelName',
            label: 'model',
            colSpan: 6,
            withAsterisk: true,
          },
          {
            control: 'text-input',
            name: 'spec',
            label: 'specHeavyEquipment',
            colSpan: 6,
          },
          {
            control: 'text-input',
            name: 'modelYear',
            label: 'modelYear',
            colSpan: 6,
            withAsterisk: true,
          },
        ],
      },
      {
        group: t('commonTypography.document'),
        enableGroupLabel: true,
        formControllers: [imageInput],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<ICreateHeavyEquipmentValues> = (
    data
  ) => {
    const { modelName, modelYear, photos, spec, typeId } = data;
    mutate({
      modelName,
      modelYear,
      photos,
      spec,
      typeId,
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

export default CreateHeavyEquipmentBook;
