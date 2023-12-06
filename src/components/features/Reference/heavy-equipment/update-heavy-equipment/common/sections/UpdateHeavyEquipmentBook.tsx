import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadAllBrand } from '@/services/graphql/query/heavy-equipment/useReadAllBrand';
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

  /* #   /**=========== Methods =========== */
  const methods = useForm<IUpdateHeavyEquipmentValues>({
    resolver: zodResolver(createHeavyEquipmentSchema),
    defaultValues: {
      photos: [],
      modelName: '',
      brandId: '',
      typeId: '',
      spec: '',
      modelYear: '',
    },
    mode: 'onBlur',
  });
  const brandId = methods.watch('brandId');
  const typeId = methods.watch('typeId');
  const photos = methods.watch('photos');

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { heavyEquipmentReferenceData, heavyEquipmentReferenceDataLoading } =
    useReadOneHeavyEquipmentReference({
      variables: {
        id,
      },
      skip: !router.isReady,
      onCompleted: (data) => {
        methods.setValue('brandId', data.heavyEquipmentReference.type.brand.id);
        methods.setValue('typeId', data.heavyEquipmentReference.type.id);
        methods.setValue('modelName', data.heavyEquipmentReference.modelName);
        methods.setValue('spec', data.heavyEquipmentReference.spec ?? '');
        methods.setValue(
          'modelYear',
          `${data.heavyEquipmentReference.modelYear ?? ''}`
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
  const { mutate, isLoading } = useUpdateHeavyEquipment({
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
        message: t('heavyEquipment.successUpdateMessage'),
        icon: <IconCheck />,
      });
      router.push('/reference/heavy-equipment');
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== FilterData =========== */
  const { combinedItems, uncombinedItem } = useCombineFilterItems({
    data: brandsData ?? [],
    combinedId: heavyEquipmentReferenceData?.type.brand.id ?? '',
    combinedName: heavyEquipmentReferenceData?.type.brand.name ?? '',
  });
  const {
    combinedItems: combinedTypeItems,
    uncombinedItem: uncombinedTypeItems,
  } = useCombineFilterItems({
    data: typesData ?? [],
    combinedId: heavyEquipmentReferenceData?.type.id ?? '',
    combinedName: heavyEquipmentReferenceData?.type.name ?? '',
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
      maxFiles: 5,
      enableDeletePhoto: true,
      serverPhotos: serverPhotos,
      onDrop: (value) => {
        if (photos) {
          const totalPhotos = photos.length + value.length;
          const totalServerPhotos =
            serverPhotos &&
            totalPhotos + (serverPhotos.length - deletedPhotoIds.length) > 5;
          if (totalPhotos > 5 || totalServerPhotos) {
            methods.setError('photos', {
              type: 'manual',
              message: 'Jumlah foto melebihi batas maksimal',
            });
            return;
          }

          methods.setValue('photos', [...photos, ...value]);
          methods.clearErrors('photos');
          return;
        }
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
              methods.trigger('typeId');
            },
            searchable: true,
            nothingFound: null,
            onSearchChange: settypeSearchTerm,
            searchValue: typeSearchTerm,
          },
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
            withAsterisk: false,
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
    brandId,
    typeId,
    combinedItems,
    uncombinedItem,
    brandSearchTerm,
    combinedTypeItems,
    typeSearchTerm,
    uncombinedTypeItems,
    serverPhotos,
    deletedPhotoIds,
    photos,
  ]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IUpdateHeavyEquipmentValues> = (
    data
  ) => {
    const { modelName, modelYear, typeId, photos, spec } = data;
    mutate({
      modelName,
      modelYear,
      typeId,
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
          onClick: () => router.push('/reference/heavy-equipment'),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateHeavyEquipmentBook;
