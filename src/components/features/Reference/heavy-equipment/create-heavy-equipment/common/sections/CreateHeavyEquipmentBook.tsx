import { FileWithPath } from '@mantine/dropzone';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { handleRejectFile } from '@/utils/helper/handleRejectFile';

import { ControllerGroup, ControllerProps } from '@/types/global';

interface ICreateHeavyEquipmentValues {
  modelId: string;
  spec: string;
  year: string;
  photos: FileWithPath[] | string | null;
  brand: string;
}

const CreateHeavyEquipmentBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();

  /* #   /**=========== Methods =========== */

  const methods = useForm<ICreateHeavyEquipmentValues>({
    defaultValues: {
      photos: [],
      modelId: '',
      spec: '',
      year: '',
      brand: '',
    },
    mode: 'onBlur',
  });

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Field =========== */
  const fieldCreateHeavyEquipment = React.useMemo(() => {
    const imageInput: ControllerProps = {
      control: 'image-dropzone',
      name: 'photos',
      label: 'photo',
      description: 'photoDescription',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      multiple: true,
      maxFiles: 3,
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
          {
            control: 'select-input',
            data: [],
            name: 'brand',
            label: 'brandHeavyEquipment',
            colSpan: 6,
            withAsterisk: true,
          },
          {
            control: 'select-input',
            data: [],
            name: 'brand',
            label: 'typeHeavyEquipment',
            colSpan: 6,
            withAsterisk: true,
          },
          {
            control: 'select-input',
            data: [],
            name: 'brand',
            label: 'modelHeavyEquipment',
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
            name: 'createdYear',
            label: 'productionYear',
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
  }, []);

  /* #endregion  /**======== Field =========== */
  return (
    <DashboardCard p={0}>
      <GlobalFormGroup
        field={fieldCreateHeavyEquipment}
        methods={methods}
        // eslint-disable-next-line no-console
        submitForm={(data) => console.log(data)}
        submitButton={{
          label: t('commonTypography.save'),
        }}
        backButton={{
          onClick: () => router.back(),
        }}
      />
    </DashboardCard>
  );
};

export default CreateHeavyEquipmentBook;
