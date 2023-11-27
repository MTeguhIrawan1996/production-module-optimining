import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadOneHeavyEquipmentReference } from '@/services/graphql/query/heavy-equipment/useReadOneHeavyEquipment';
import { useReadOneHeavyEquipmentCompany } from '@/services/graphql/query/heavy-equipment/useReadOneHeavyEquipmentCompany';
import { ICreateHeavyEquipmentCompanyValues } from '@/services/restapi/heavy-equipment/useCreateHeavyEquipmentCompany';
import { useUpdateHeavyEquipmentCompany } from '@/services/restapi/heavy-equipment/useUpdateHeavyEquipmentCompany';
import {
  brandSelect,
  classSelect,
  eligibilityStatusSelect,
  globalDate,
  globalText,
  modelSelect,
  typeSelect,
} from '@/utils/constants/Field/global-field';
import { createHeavyEquipmentCompanySchema } from '@/utils/form-validation/master-heavy-equipment/heavy-equipment-validation';
import { stringToDate } from '@/utils/helper/dateToString';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import { ControllerGroup, ControllerProps, IFile } from '@/types/global';

const UpdateCompanyHeavyEquipmentBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const companyId = router.query?.id?.[0] as string;
  const companyHeavyEquipmentId = router.query?.id?.[1] as string;
  const [heavyEquipmentId, setHeavyEquipmentId] = React.useState<string>('');
  const [serverPhotos, setServerPhotos] = React.useState<
    Omit<IFile, 'mime' | 'path'>[] | null
  >([]);
  const [deletedPhotoIds, setDeletedPhotoIds] = React.useState<string[]>([]);
  const [serverVehicleNumberPhoto, setServerVehicleNumberPhoto] =
    React.useState<Omit<IFile, 'mime' | 'path'>[] | null>([]);

  /* #   /**=========== Methods =========== */
  const methods = useForm<ICreateHeavyEquipmentCompanyValues>({
    resolver: zodResolver(createHeavyEquipmentCompanySchema),
    defaultValues: {
      hullNumber: '',
      engineNumber: '',
      chassisNumber: '',
      brandId: '',
      referenceId: '',
      typeId: '',
      specification: '',
      vehicleNumber: '',
      classId: '',
      eligibilityStatusId: '',
      createdYear: '',
      startDate: undefined,
      endDate: undefined,
      isStill: false,
      vehicleNumberPhoto: [],
      photos: [],
    },
    mode: 'onBlur',
  });
  const brandId = methods.watch('brandId');
  const typeId = methods.watch('typeId');
  const referenceId = methods.watch('referenceId');
  const isStill = methods.watch('isStill');
  const photos = methods.watch('photos');
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */

  const { heavyEquipmentCompanyData, heavyEquipmentCompanyDataLoading } =
    useReadOneHeavyEquipmentCompany({
      variables: {
        id: companyHeavyEquipmentId,
      },
      skip: !router.isReady,
      onCompleted: ({ companyHeavyEquipment }) => {
        setHeavyEquipmentId(companyHeavyEquipment.heavyEquipment?.id ?? '');
        methods.setValue('hullNumber', companyHeavyEquipment.hullNumber ?? '');
        methods.setValue(
          'engineNumber',
          companyHeavyEquipment.heavyEquipment?.engineNumber ?? ''
        );
        methods.setValue(
          'chassisNumber',
          companyHeavyEquipment.heavyEquipment?.chassisNumber ?? ''
        );
        methods.setValue(
          'brandId',
          companyHeavyEquipment.heavyEquipment?.reference?.type?.brand?.id ?? ''
        );
        methods.setValue(
          'typeId',
          companyHeavyEquipment.heavyEquipment?.reference?.type?.id ?? ''
        );
        methods.setValue(
          'referenceId',
          companyHeavyEquipment.heavyEquipment?.reference?.id ?? ''
        );
        methods.setValue(
          'vehicleNumber',
          companyHeavyEquipment.heavyEquipment?.vehicleNumber ?? ''
        );
        methods.setValue(
          'classId',
          companyHeavyEquipment.heavyEquipment?.class?.id ?? ''
        );
        methods.setValue(
          'eligibilityStatusId',
          companyHeavyEquipment.heavyEquipment?.eligibilityStatus?.id ?? ''
        );
        methods.setValue(
          'specification',
          companyHeavyEquipment.heavyEquipment?.reference?.spec ?? ''
        );
        methods.setValue(
          'createdYear',
          `${companyHeavyEquipment.heavyEquipment?.createdYear ?? ''}`
        );
        methods.setValue('isStill', companyHeavyEquipment.isStill ?? false);
        const date = stringToDate(companyHeavyEquipment.startDate ?? null);
        const endDate = stringToDate(companyHeavyEquipment.endDate ?? null);
        methods.setValue('startDate', date);
        methods.setValue('endDate', endDate);
        setServerPhotos(companyHeavyEquipment.heavyEquipment?.photos ?? []);
        if (companyHeavyEquipment.heavyEquipment?.vehicleNumberPhoto) {
          setServerVehicleNumberPhoto([
            companyHeavyEquipment.heavyEquipment.vehicleNumberPhoto,
          ]);
        }
      },
    });

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

  const { mutate, isLoading } = useUpdateHeavyEquipmentCompany({
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
        message: t('heavyEquipment.successUpdateCompanyMessage'),
        icon: <IconCheck />,
      });
      const url = `/master-data/company/read/${companyId}`;
      router.push(url);
      methods.reset();
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */
  const fieldCreateHeavyEquipment = React.useMemo(() => {
    const hullNumber = globalText({
      name: `hullNumber`,
      label: 'heavyEquipmentCode',
      colSpan: 6,
    });
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
    const vehicleNumber = globalText({
      name: 'vehicleNumber',
      label: 'vehicleNumberOrRegirstrationNumber',
      colSpan: 6,
      withAsterisk: true,
    });
    const createdYear = globalText({
      name: 'createdYear',
      label: 'productionYear',
      colSpan: 6,
    });
    const brandItem = brandSelect({
      label: 'brandHeavyEquipment',
      defaultValue:
        heavyEquipmentCompanyData?.heavyEquipment?.reference?.type?.brand?.id,
      labelValue:
        heavyEquipmentCompanyData?.heavyEquipment?.reference?.type?.brand?.name,
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
      defaultValue:
        heavyEquipmentCompanyData?.heavyEquipment?.reference?.type?.id,
      labelValue:
        heavyEquipmentCompanyData?.heavyEquipment?.reference?.type?.name,
      brandId,
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
      defaultValue: heavyEquipmentCompanyData?.heavyEquipment?.reference?.id,
      labelValue:
        heavyEquipmentCompanyData?.heavyEquipment?.reference?.modelName,
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
      defaultValue: heavyEquipmentCompanyData?.heavyEquipment?.class?.id,
      labelValue: heavyEquipmentCompanyData?.heavyEquipment?.class?.name,
    });
    const eligibilityStatusItem = eligibilityStatusSelect({});

    const startDateItem = globalDate({
      name: 'startDate',
      label: 'startDate',
      colSpan: 6,
    });
    const endDateItem = globalDate({
      name: 'endDate',
      label: 'endDate',
      withAsterisk: false,
      colSpan: 6,
      disabled: isStill,
    });

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
        handleRejectFile<ICreateHeavyEquipmentCompanyValues>({
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
        handleRejectFile<ICreateHeavyEquipmentCompanyValues>({
          methods,
          files,
          field: 'photos',
        }),
    };
    const field: ControllerGroup[] = [
      {
        group: t('heavyEquipment.informationHeavyEquipmentMaster'),
        enableGroupLabel: true,
        groupCheckbox: {
          onChange: () => {
            isStill === true
              ? methods.setValue('isStill', false)
              : methods.setValue('isStill', true);
            methods.setValue('endDate', null);
          },
          checked: isStill,
          label: t('commonTypography.stillInUse'),
        },
        formControllers: [
          hullNumber,
          engineNumber,
          frameNumber,
          brandItem,
          typeItem,
          modelItem,
          specification,
          vehicleNumber,
          classItem,
          eligibilityStatusItem,
          createdYear,
          startDateItem,
          endDateItem,
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
    isStill,
    photos,
    serverVehicleNumberPhoto,
    deletedPhotoIds,
    serverPhotos,
  ]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<ICreateHeavyEquipmentCompanyValues> = (
    data
  ) => {
    const values = objectToArrayValue(data);
    const deletedVehicleNumberPhoto =
      serverVehicleNumberPhoto && serverVehicleNumberPhoto.length === 0;
    mutate({
      companyId: companyId,
      deletedPhotoIds,
      heavyEquipmentId,
      companyHeavyEquipmentId,
      data: values,
      deletedVehicleNumberPhoto,
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={heavyEquipmentCompanyDataLoading}>
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

export default UpdateCompanyHeavyEquipmentBook;
