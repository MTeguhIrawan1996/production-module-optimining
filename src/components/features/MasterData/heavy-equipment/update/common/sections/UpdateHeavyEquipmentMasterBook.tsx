import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadOneHeavyEquipmentReference } from '@/services/graphql/query/heavy-equipment/useReadOneHeavyEquipment';
import { useReadOneHeavyEquipmentMaster } from '@/services/graphql/query/heavy-equipment/useReadOneHeavyEquipmentMaster';
import {
  IUpdateHeavyEquipmentMasterValues,
  useUpdateHeavyEquipmentMaster,
} from '@/services/restapi/heavy-equipment/useUpdateHeavyEquipmentMaster';
import {
  brandSelect,
  classSelect,
  eligibilityStatusSelect,
  globalText,
  modelSelect,
  typeSelect,
} from '@/utils/constants/Field/global-field';
import { createHeavyEquipmentMasterSchema } from '@/utils/form-validation/master-heavy-equipment/heavy-equipment-validation';
import { sendGAEvent } from '@/utils/helper/analytics';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import { ControllerGroup, ControllerProps, IFile } from '@/types/global';

const UpdateHeavyEquipmentMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });

  const id = router.query.id as string;
  const [serverPhotos, setServerPhotos] = React.useState<
    Omit<IFile, 'mime' | 'path'>[] | null
  >([]);
  const [deletedPhotoIds, setDeletedPhotoIds] = React.useState<string[]>([]);
  const [serverVehicleNumberPhoto, setServerVehicleNumberPhoto] =
    React.useState<Omit<IFile, 'mime' | 'path'>[] | null>([]);

  const methods = useForm<Omit<IUpdateHeavyEquipmentMasterValues, 'id'>>({
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
  const referenceId = methods.watch('referenceId');
  const photos = methods.watch('photos');

  /* #   /**=========== Query =========== */

  useReadOneHeavyEquipmentReference({
    variables: {
      id: referenceId,
    },
    skip: referenceId === '',
    onCompleted: (data) => {
      methods.setValue(
        'specification',
        data.heavyEquipmentReference.spec ?? ''
      );
    },
  });

  const { heavyEquipmentMasterData, heavyEquipmentMasterDataLoading } =
    useReadOneHeavyEquipmentMaster({
      variables: {
        id,
      },
      skip: !router.isReady,
      onCompleted: ({ heavyEquipment }) => {
        methods.setValue(
          'brandId',
          heavyEquipment?.reference?.type?.brand?.id ?? ''
        );
        methods.setValue('chassisNumber', heavyEquipment?.chassisNumber ?? '');
        methods.setValue('referenceId', heavyEquipment?.reference?.id ?? '');
        methods.setValue(
          'specification',
          heavyEquipment?.reference?.spec ?? ''
        );
        methods.setValue('typeId', heavyEquipment?.reference?.type?.id ?? '');
        methods.setValue('classId', heavyEquipment.class?.id ?? '');
        methods.setValue(
          'brandId',
          heavyEquipment?.reference?.type?.brand?.id ?? ''
        );
        methods.setValue('createdYear', `${heavyEquipment.createdYear}` ?? '');
        methods.setValue('vehicleNumber', heavyEquipment.vehicleNumber ?? '');
        methods.setValue(
          'eligibilityStatusId',
          heavyEquipment.eligibilityStatus?.id ?? ''
        );
        methods.setValue('engineNumber', heavyEquipment.engineNumber ?? '');

        setServerPhotos(heavyEquipment.photos ?? []);
        if (heavyEquipment.vehicleNumberPhoto) {
          setServerVehicleNumberPhoto([heavyEquipment.vehicleNumberPhoto]);
        }
      },
    });

  const { mutate, isLoading } = useUpdateHeavyEquipmentMaster({
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
      sendGAEvent({
        event: 'Edit',
        params: {
          category: 'Administrasi',
          subSubCategory: '',
          subCategory: 'Administrasi - Alat Berat',
          account: userAuthData?.email ?? '',
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('heavyEquipment.successUpdateMasterMessage'),
        icon: <IconCheck />,
      });
      router.push('/master-data/heavy-equipment');
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */
  const field = React.useMemo(() => {
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
      disabled: true,
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
    });
    const brandItem = brandSelect({
      label: 'brandHeavyEquipment',
      defaultValue: heavyEquipmentMasterData?.reference?.type?.brand?.id,
      labelValue: heavyEquipmentMasterData?.reference?.type?.brand?.name,
      onChange: (value) => {
        methods.setValue('brandId', value ?? '');
        methods.setValue('typeId', '');
        methods.setValue('referenceId', '');
        methods.setValue('specification', '');
        methods.trigger('brandId');
      },
    });
    const typeItem = typeSelect({
      label: 'typeHeavyEquipment',
      brandId,
      defaultValue: heavyEquipmentMasterData?.reference?.type?.id,
      labelValue: heavyEquipmentMasterData?.reference?.type?.name,
      onChange: (value) => {
        methods.setValue('typeId', value ?? '');
        methods.setValue('referenceId', '');
        methods.setValue('specification', '');
        methods.trigger('typeId');
      },
    });
    const modelItem = modelSelect({
      label: 'modelHeavyEquipment',
      name: 'referenceId',
      defaultValue: heavyEquipmentMasterData?.reference?.id,
      labelValue: heavyEquipmentMasterData?.reference?.modelName,
      brandId,
      typeId,
      onChange: (value) => {
        methods.setValue('referenceId', value ?? '');
        methods.setValue('specification', '');
        methods.trigger('referenceId');
      },
    });
    const classItem = classSelect({
      label: 'class',
      defaultValue: heavyEquipmentMasterData?.class?.id,
      labelValue: heavyEquipmentMasterData?.class?.name,
    });
    const eligibilityStatusItem = eligibilityStatusSelect({});

    const vehicleNumberPhoto: ControllerProps = {
      control: 'image-dropzone',
      name: 'vehicleNumberPhoto',
      label: 'vehicleDocument',
      description: 'photoDescription',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      multiple: false,
      enableDeletePhoto: true,
      serverPhotos: serverVehicleNumberPhoto,
      handleDeleteServerPhotos: () => {
        setServerVehicleNumberPhoto([]);
      },
      onDrop: (value) => {
        setServerVehicleNumberPhoto([]);
        methods.setValue('vehicleNumberPhoto', value);
        methods.clearErrors('vehicleNumberPhoto');
      },
      onReject: (files) =>
        handleRejectFile<Omit<IUpdateHeavyEquipmentMasterValues, 'id'>>({
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
        handleRejectFile<Omit<IUpdateHeavyEquipmentMasterValues, 'id'>>({
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
  }, [
    brandId,
    typeId,
    referenceId,
    heavyEquipmentMasterData,
    serverPhotos,
    deletedPhotoIds,
    serverVehicleNumberPhoto,
    photos,
  ]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<
    Omit<IUpdateHeavyEquipmentMasterValues, 'id'>
  > = (data) => {
    const values = objectToArrayValue(data);
    const deletedVehicleNumberPhoto =
      serverVehicleNumberPhoto && serverVehicleNumberPhoto.length === 0;

    mutate({
      id,
      deletedPhotoIds,
      data: values,
      deletedVehicleNumberPhoto,
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={heavyEquipmentMasterDataLoading}>
      <GlobalFormGroup
        field={field}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: isLoading,
        }}
        backButton={{
          onClick: () => router.push('/master-data/heavy-equipment'),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateHeavyEquipmentMasterBook;
