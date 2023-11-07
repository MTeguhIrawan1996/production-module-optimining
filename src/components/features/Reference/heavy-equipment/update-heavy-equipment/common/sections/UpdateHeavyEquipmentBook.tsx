import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadAllBrand } from '@/services/graphql/query/heavy-equipment/useReadAllBrand';
import { useReadAllHeavyEquipmentModel } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentModel';
import { useReadAllHeavyEquipmentType } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentType';
import { useReadOneHeavyEquipmentReference } from '@/services/graphql/query/heavy-equipment/useReadOneHeavyEquipment';
import {
  IUpdateHeavyEquipmentValuesQuery,
  useUpdateHeavyEquipment,
} from '@/services/restapi/heavy-equipment/useUpdateHeavyEquipment';
import { createHeavyEquipmentSchema } from '@/utils/form-validation/reference-heavy-equipment/heavy-equipment-validation';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { ControllerGroup, ControllerProps, IFile } from '@/types/global';

type IUpdateHeavyEquipmentValues = Omit<
  IUpdateHeavyEquipmentValuesQuery,
  'id' | 'deletedPhotoIds'
>;

const UpdateHeavyEquipmentBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [serverPhotos, setServerPhotos] = React.useState<
    Omit<IFile, 'mime' | 'path'>[] | null
  >([]);
  const [deletedPhotoIds, setDeletedPhotoIds] = React.useState<string[]>([]);
  const [brandSearchTerm, setBrandSearchTerm] = React.useState<string>('');
  const [brandSearchQuery] = useDebouncedValue<string>(brandSearchTerm, 400);
  const [typeSearchTerm, settypeSearchTerm] = React.useState<string>('');
  const [typeSearchQuery] = useDebouncedValue<string>(typeSearchTerm, 400);
  const [modelSearchTerm, setModelSearchTerm] = React.useState<string>('');
  const [modelSearchQuery] = useDebouncedValue<string>(modelSearchTerm, 400);

  /* #   /**=========== Methods =========== */
  const methods = useForm<IUpdateHeavyEquipmentValues>({
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
  const modelId = methods.watch('modelId');
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { heavyEquipmentReferenceData, heavyEquipmentReferenceDataLoading } =
    useReadOneHeavyEquipmentReference({
      variables: {
        id,
      },
      skip: !router.isReady,
      onCompleted: (data) => {
        methods.setValue(
          'brandId',
          data.heavyEquipmentReference.model.type.brand.id
        );
        methods.setValue('typeId', data.heavyEquipmentReference.model.type.id);
        methods.setValue('modelId', data.heavyEquipmentReference.model.id);
        methods.setValue('spec', data.heavyEquipmentReference.spec);
        methods.setValue(
          'createdYear',
          `${data.heavyEquipmentReference.createdYear}`
        );
        setServerPhotos(data.heavyEquipmentReference.photos);
      },
    });
  const { brandsData } = useReadAllBrand({
    variables: {
      limit: 15,
      search: brandSearchQuery === '' ? null : brandSearchQuery,
    },
    skip: !heavyEquipmentReferenceData,
  });
  const { typesData } = useReadAllHeavyEquipmentType({
    variables: {
      limit: 15,
      search: typeSearchQuery === '' ? null : typeSearchQuery,
      brandId: brandId === '' ? null : brandId,
    },
    skip: !heavyEquipmentReferenceData,
  });
  const { modelsData } = useReadAllHeavyEquipmentModel({
    variables: {
      limit: 15,
      search: modelSearchQuery === '' ? null : modelSearchQuery,
      brandId: brandId === '' ? null : brandId,
      typeId: typeId === '' ? null : typeId,
    },
    skip: !heavyEquipmentReferenceData,
  });
  const { mutate, isLoading } = useUpdateHeavyEquipment({
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
        message: t('heavyEquipment.successUpdateMessage'),
        icon: <IconCheck />,
      });
      router.push('/reference/heavy-equipment');
      methods.reset();
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== FilterData =========== */
  const { combinedItems, uncombinedItem } = useCombineFilterItems({
    data: brandsData ?? [],
    combinedId: heavyEquipmentReferenceData?.model.type.brand.id ?? '',
    combinedName: heavyEquipmentReferenceData?.model.type.brand.name ?? '',
  });
  const {
    combinedItems: combinedTypeItems,
    uncombinedItem: uncombinedTypeItems,
  } = useCombineFilterItems({
    data: typesData ?? [],
    combinedId: heavyEquipmentReferenceData?.model.type.id ?? '',
    combinedName: heavyEquipmentReferenceData?.model.type.name ?? '',
  });
  const {
    combinedItems: combinedModelItems,
    uncombinedItem: uncombinedModelItems,
  } = useCombineFilterItems({
    data: modelsData ?? [],
    combinedId: heavyEquipmentReferenceData?.model.id ?? '',
    combinedName: heavyEquipmentReferenceData?.model.name ?? '',
  });
  /* #endregion  /**======== FilterData =========== */

  /* #   /**=========== Field =========== */
  const field = React.useMemo(() => {
    const imageInput: ControllerProps = {
      control: 'image-dropzone',
      name: 'photos',
      label: 'photo',
      description: 'photoDescription5',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      multiple: true,
      maxFiles: serverPhotos ? 5 - serverPhotos.length : 5,
      enableDeletePhoto: true,
      serverPhotos: serverPhotos,
      onDrop: (value) => {
        methods.setValue('photos', value);
        methods.clearErrors('photos');
      },
      deletedPhotoIds: deletedPhotoIds,
      handleDeleteServerPhotos: (id) =>
        setDeletedPhotoIds((prev) => [...prev, id]),
      onReject: (files) =>
        handleRejectFile<IUpdateHeavyEquipmentValues>({
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
            data: brandId === '' ? uncombinedItem : combinedItems,
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
            data: typeId === '' ? uncombinedTypeItems : combinedTypeItems,
            name: 'typeId',
            label: 'typeHeavyEquipment',
            placeholder: 'chooseType',
            colSpan: 6,
            withAsterisk: true,
            clearable: true,
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
            data: modelId === '' ? uncombinedModelItems : combinedModelItems,
            label: 'modelHeavyEquipment',
            placeholder: 'chooseModel',
            colSpan: 6,
            withAsterisk: true,
            clearable: true,
            searchable: true,
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
    modelId,
    brandId,
    typeId,
    combinedItems,
    uncombinedItem,
    brandSearchTerm,
    combinedModelItems,
    modelSearchTerm,
    uncombinedModelItems,
    combinedTypeItems,
    typeSearchTerm,
    uncombinedTypeItems,
  ]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IUpdateHeavyEquipmentValues> = (
    data
  ) => {
    const { modelId, createdYear, photos, spec } = data;
    mutate({
      modelId,
      createdYear,
      photos,
      spec,
      deletedPhotoIds,
      id,
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={heavyEquipmentReferenceDataLoading}>
      <GlobalFormGroup
        field={field}
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

export default UpdateHeavyEquipmentBook;
