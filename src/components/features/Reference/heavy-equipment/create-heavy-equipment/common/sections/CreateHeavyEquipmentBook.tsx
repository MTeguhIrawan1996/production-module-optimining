import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IBrandData,
  useReadAllBrand,
} from '@/services/graphql/query/heavy-equipment/useReadAllBrand';
import {
  IHeavyEquipmentModelData,
  useReadAllHeavyEquipmentModel,
} from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentModel';
import {
  IHeavyEquipmentTypeData,
  useReadAllHeavyEquipmentType,
} from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentType';
import {
  ICreateHeavyEquipmentValues,
  useCreateHeavyEquipment,
} from '@/services/restapi/heavy-equipment/useCreateHeavyEquipment';
import { createHeavyEquipmentSchema } from '@/utils/form-validation/reference-heavy-equipment/heavy-equipment-validation';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';

import { ControllerGroup, ControllerProps } from '@/types/global';

const CreateHeavyEquipmentBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const [brandSearchTerm, setBrandSearchTerm] = React.useState<string>('');
  const [brandSearchQuery] = useDebouncedValue<string>(brandSearchTerm, 400);
  const [typeSearchTerm, settypeSearchTerm] = React.useState<string>('');
  const [typeSearchQuery] = useDebouncedValue<string>(typeSearchTerm, 400);
  const [modelSearchTerm, setModelSearchTerm] = React.useState<string>('');
  const [modelSearchQuery] = useDebouncedValue<string>(modelSearchTerm, 400);

  /* #   /**=========== Methods =========== */
  const methods = useForm<ICreateHeavyEquipmentValues>({
    resolver: zodResolver(createHeavyEquipmentSchema),
    defaultValues: {
      photos: [],
      modelId: '',
      brandId: '',
      typeId: '',
      spec: '',
      createdYear: '',
    },
    mode: 'onBlur',
  });
  const brandId = methods.watch('brandId');
  const typeId = methods.watch('typeId');
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { brandsData } = useReadAllBrand({
    variables: {
      limit: 15,
      search: brandSearchQuery === '' ? null : brandSearchQuery,
    },
  });
  const { typesData } = useReadAllHeavyEquipmentType({
    variables: {
      limit: 15,
      search: typeSearchQuery === '' ? null : typeSearchQuery,
      brandId,
    },
  });
  const { modelsData } = useReadAllHeavyEquipmentModel({
    variables: {
      limit: 15,
      search: modelSearchQuery === '' ? null : modelSearchQuery,
      brandId,
      typeId,
    },
  });
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
      // router.push('/reference/heavy-equipment');
      // methods.reset();
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== FilterData =========== */
  const renderBrands = React.useCallback((value: IBrandData) => {
    return {
      label: value.name,
      value: value.id,
    };
  }, []);
  const brandItems = brandsData?.map(renderBrands);

  const renderTypes = React.useCallback((value: IHeavyEquipmentTypeData) => {
    return {
      label: value.name,
      value: value.id,
    };
  }, []);
  const typeItems = typesData?.map(renderTypes);

  const renderModel = React.useCallback((value: IHeavyEquipmentModelData) => {
    return {
      label: value.name,
      value: value.id,
    };
  }, []);
  const modelItems = modelsData?.map(renderModel);
  /* #endregion  /**======== FilterData =========== */

  /* #   /**=========== Field =========== */
  const fieldCreateHeavyEquipment = React.useMemo(() => {
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
          {
            control: 'select-input',
            data: brandItems ?? [],
            name: 'brandId',
            label: 'brandHeavyEquipment',
            placeholder: 'chooseBrand',
            colSpan: 6,
            withAsterisk: true,
            clearable: true,
            searchable: true,
            nothingFound: null,
            onSearchChange: setBrandSearchTerm,
            searchValue: brandSearchTerm,
            onChange: (value) => {
              methods.setValue('brandId', value ?? '');
              methods.setValue('typeId', '');
              methods.setValue('modelId', '');
              methods.trigger('brandId');
            },
          },
          {
            control: 'select-input',
            data: typeItems ?? [],
            name: 'typeId',
            label: 'typeHeavyEquipment',
            placeholder: 'chooseType',
            colSpan: 6,
            clearable: true,
            withAsterisk: true,
            onChange: (value) => {
              methods.setValue('typeId', value ?? '');
              methods.setValue('modelId', '');
              methods.trigger('typeId');
            },
            searchable: true,
            nothingFound: null,
            onSearchChange: settypeSearchTerm,
            searchValue: typeSearchTerm,
          },
          {
            control: 'select-input',
            onChange: (value) => {
              methods.setValue('modelId', value ?? '');
              methods.trigger('modelId');
            },
            name: 'modelId',
            data: modelItems ?? [],
            label: 'modelHeavyEquipment',
            placeholder: 'chooseModel',
            colSpan: 6,
            withAsterisk: true,
            searchable: true,
            clearable: true,
            nothingFound: null,
            onSearchChange: setModelSearchTerm,
            searchValue: modelSearchTerm,
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
  }, [
    brandItems,
    brandSearchTerm,
    modelItems,
    modelSearchTerm,
    typeItems,
    typeSearchTerm,
  ]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<ICreateHeavyEquipmentValues> = (
    data
  ) => {
    const { modelId, createdYear, photos, spec } = data;
    mutate({
      modelId,
      createdYear,
      photos,
      spec,
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
