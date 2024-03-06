import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadOneMovingRitage } from '@/services/graphql/query/moving-ritage/useReadOneMovingRitage';
import { IMutationRitageMoving } from '@/services/restapi/ritage-productions/moving/useCreateRitageMoving';
import { useUpdateRitageMoving } from '@/services/restapi/ritage-productions/moving/useUpdateRitageMoving';
import {
  employeeSelect,
  globalDate,
  globalNumberInput,
  globalText,
  globalTimeInput,
  heavyEquipmentSelect,
  materialSelect,
  weatherSelect,
} from '@/utils/constants/Field/global-field';
import { shiftSelect } from '@/utils/constants/Field/sample-house-field';
import { domeNameSelect } from '@/utils/constants/Field/stockpile-field';
import { ritageMovingMutationValidation } from '@/utils/form-validation/ritage/ritage-moving-validation';
import { countTonByRitage } from '@/utils/helper/countTonByRitage';
import { formatDate } from '@/utils/helper/dateFormat';
import { dateToString, stringToDate } from '@/utils/helper/dateToString';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { hourDiff } from '@/utils/helper/hourDiff';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import { ControllerGroup, ControllerProps, IFile } from '@/types/global';

const UpdateRitageMovingBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [newFromTime, setNewFromTime] = useDebouncedState<string>('', 400);
  const [newArriveTime, setNewArriveTime] = useDebouncedState<string>('', 400);
  const [newBulkSamplingDensity, setNewBulkSamplingDensity] =
    useDebouncedState<string>('', 400);
  const [newBucketVolume, setNewBucketVolume] = useDebouncedState<string>(
    '',
    400
  );
  const [serverPhotos, setServerPhotos] = React.useState<
    Omit<IFile, 'mime' | 'path'>[] | null
  >([]);
  const [deletedPhotoIds, setDeletedPhotoIds] = React.useState<string[]>([]);
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationRitageMoving>({
    resolver: zodResolver(ritageMovingMutationValidation),
    defaultValues: {
      date: undefined,
      checkerFromId: '',
      checkerFromPosition: '',
      checkerToId: '',
      checkerToPosition: '',
      shiftId: '',
      companyHeavyEquipmentId: '',
      materialId: '',
      subMaterialId: '',
      fromTime: '',
      arriveTime: '',
      ritageDuration: '',
      weatherId: '',
      fromDomeId: '',
      toDomeId: '',
      bulkSamplingDensity: '',
      bucketVolume: '',
      tonByRitage: '',
      sampleNumber: '',
      desc: '',
      photos: [],
      isRitageProblematic: false,
      companyHeavyEquipmentChangeId: '',
    },
    mode: 'onBlur',
  });
  const photos = methods.watch('photos');
  const isRitageProblematic = methods.watch('isRitageProblematic');

  React.useEffect(() => {
    const ritageDuration = hourDiff({
      startTime: newFromTime,
      endTime: newArriveTime,
      functionIsBeforeEndTime: true,
    });
    const amount = countTonByRitage(newBucketVolume, newBulkSamplingDensity);
    methods.setValue('tonByRitage', `${!amount ? '' : amount}`);
    methods.setValue('ritageDuration', ritageDuration ?? '');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newFromTime, newArriveTime, newBulkSamplingDensity, newBucketVolume]);

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { movingRitage, movingRitageLoading } = useReadOneMovingRitage({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: ({ movingRitage }) => {
      const ritageDate = stringToDate(movingRitage.date ?? null);
      const fromTime = formatDate(movingRitage.fromAt, 'HH:mm:ss');
      const arriveTime = formatDate(movingRitage.arriveAt, 'HH:mm:ss');
      methods.setValue('isRitageProblematic', movingRitage.isRitageProblematic);
      methods.setValue('date', ritageDate);
      methods.setValue('checkerFromId', movingRitage.checkerFrom?.id ?? '');
      methods.setValue(
        'checkerFromPosition',
        movingRitage.checkerFromPosition ?? ''
      );
      methods.setValue('checkerToId', movingRitage.checkerTo?.id ?? '');
      methods.setValue(
        'checkerToPosition',
        movingRitage.checkerToPosition ?? ''
      );
      methods.setValue('shiftId', movingRitage.shift?.id ?? '');
      methods.setValue(
        'companyHeavyEquipmentId',
        movingRitage.companyHeavyEquipment?.id ?? ''
      );
      methods.setValue(
        'companyHeavyEquipmentChangeId',
        movingRitage.companyHeavyEquipmentChange?.id ?? ''
      );
      methods.setValue('materialId', movingRitage.material?.id ?? '');
      methods.setValue('subMaterialId', movingRitage.subMaterial?.id ?? '');
      methods.setValue('fromTime', fromTime ?? '');
      setNewFromTime(fromTime ?? '');
      methods.setValue('arriveTime', arriveTime ?? '');
      setNewArriveTime(arriveTime ?? '');
      methods.setValue('weatherId', movingRitage.weather?.id ?? '');
      methods.setValue('fromDomeId', movingRitage.fromDome?.id ?? '');
      methods.setValue('toDomeId', movingRitage.toDome?.id ?? '');
      methods.setValue(
        'bulkSamplingDensity',
        movingRitage.bulkSamplingDensity ?? ''
      );
      setNewBulkSamplingDensity(`${movingRitage.bulkSamplingDensity ?? ''}`);
      methods.setValue('bucketVolume', movingRitage.bucketVolume ?? '');
      setNewBucketVolume(`${movingRitage.bucketVolume ?? ''}`);
      methods.setValue('sampleNumber', movingRitage.sampleNumber ?? '');
      methods.setValue('desc', movingRitage.desc ?? '');
      setServerPhotos(movingRitage.photos ?? []);
    },
  });

  const { mutate, isLoading } = useUpdateRitageMoving({
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
        message: t('ritageMoving.successUpdateMessage'),
        icon: <IconCheck />,
      });
      setIsOpenConfirmation((prev) => !prev);
      methods.reset();
      router.push('/input-data/production/data-ritage?tabs=moving');
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */

  const fieldRhf = React.useMemo(() => {
    const date = globalDate({
      name: 'date',
      label: 'date',
      withAsterisk: true,
      clearable: true,
      colSpan: 12,
    });
    const fromCheckerName = employeeSelect({
      colSpan: 6,
      name: 'checkerFromId',
      label: 'fromCheckerName',
      withAsterisk: true,
      positionId: `${process.env.NEXT_PUBLIC_EMPLOYEE_CHECKER_ID}`,
      defaultValue: movingRitage?.checkerFrom?.id,
      labelValue: movingRitage?.checkerFrom?.humanResource?.name,
    });
    const fromCheckerPosition = globalText({
      name: 'checkerFromPosition',
      label: 'fromCheckerPosition',
      colSpan: 6,
      withAsterisk: false,
    });
    const toCheckerName = employeeSelect({
      colSpan: 6,
      name: 'checkerToId',
      label: 'toCheckerName',
      withAsterisk: false,
      positionId: `${process.env.NEXT_PUBLIC_EMPLOYEE_CHECKER_ID}`,
      defaultValue: movingRitage?.checkerTo?.id,
      labelValue: movingRitage?.checkerTo?.humanResource?.name,
    });
    const toCheckerPosition = globalText({
      colSpan: 6,
      name: 'checkerToPosition',
      label: 'toCheckerPosition',
      withAsterisk: false,
    });
    const shiftItem = shiftSelect({
      colSpan: 6,
      name: 'shiftId',
    });
    const hullNumber = heavyEquipmentSelect({
      colSpan: 6,
      name: 'companyHeavyEquipmentId',
      label: 'heavyEquipmentCode',
      withAsterisk: true,
      categoryId: `${process.env.NEXT_PUBLIC_DUMP_TRUCK_ID}`,
      defaultValue: movingRitage?.companyHeavyEquipment?.id,
      labelValue: movingRitage?.companyHeavyEquipment?.hullNumber ?? '',
    });
    const hullNumberSubstitution = heavyEquipmentSelect({
      colSpan: 6,
      name: 'companyHeavyEquipmentChangeId',
      label: 'heavyEquipmentCodeSubstitution',
      withAsterisk: true,
      categoryId: `${process.env.NEXT_PUBLIC_DUMP_TRUCK_ID}`,
      defaultValue: movingRitage?.companyHeavyEquipmentChange?.id,
      labelValue: movingRitage?.companyHeavyEquipmentChange?.hullNumber ?? '',
    });
    const materialItem = materialSelect({
      colSpan: 6,
      name: 'materialId',
      label: 'material',
      withAsterisk: true,
      disabled: true,
      includeIds: [`${process.env.NEXT_PUBLIC_MATERIAL_ORE_ID}`],
    });
    const materialSubItem = materialSelect({
      colSpan: 6,
      name: 'subMaterialId',
      label: 'subMaterial',
      withAsterisk: true,
      parentId: `${process.env.NEXT_PUBLIC_MATERIAL_ORE_ID}`,
      isHaveParent: null,
    });
    const fromTime = globalTimeInput({
      name: 'fromTime',
      label: 'fromTime',
      withAsterisk: true,
      colSpan: 6,
      onChange: (e) => {
        methods.setValue('fromTime', e.currentTarget.value);
        setNewFromTime(e.currentTarget.value);
        methods.trigger('fromTime');
      },
    });
    const arriveTime = globalTimeInput({
      name: 'arriveTime',
      label: 'arriveTime',
      withAsterisk: false,
      colSpan: 6,
      onChange: (e) => {
        methods.setValue('arriveTime', e.currentTarget.value);
        setNewArriveTime(e.currentTarget.value);
        methods.trigger('arriveTime');
      },
    });
    const ritageDurationItem = globalText({
      name: 'ritageDuration',
      label: 'ritageDuration',
      colSpan: 6,
      disabled: true,
      withAsterisk: false,
    });
    const weatherItem = weatherSelect({
      colSpan: 6,
      name: 'weatherId',
    });
    const fromDomeIdItem = domeNameSelect({
      colSpan: 6,
      name: 'fromDomeId',
      label: 'fromDome',
      withAsterisk: true,
      defaultValue: movingRitage?.fromDome?.id,
      labelValue: movingRitage?.fromDome?.name,
    });
    const toDomeIdItem = domeNameSelect({
      colSpan: 6,
      name: 'toDomeId',
      label: 'toDome',
      withAsterisk: false,
      defaultValue: movingRitage?.toDome?.id,
      labelValue: movingRitage?.toDome?.name,
    });
    const bulkSamplingDensityItem = globalNumberInput({
      colSpan: 6,
      name: 'bulkSamplingDensity',
      label: 'bulkSamplingDensity',
      withAsterisk: true,
      onChange: (value) => {
        methods.setValue('bulkSamplingDensity', value);
        setNewBulkSamplingDensity(`${value}`);
        methods.trigger('bulkSamplingDensity');
      },
    });
    const bucketVolumeItem = globalNumberInput({
      colSpan: 6,
      name: 'bucketVolume',
      label: 'bucketVolume',
      withAsterisk: true,
      onChange: (value) => {
        methods.setValue('bucketVolume', value);
        setNewBucketVolume(`${value}`);
        methods.trigger('bucketVolume');
      },
    });
    const tonByRitageItem = globalText({
      colSpan: 6,
      name: 'tonByRitage',
      label: 'tonByRitage',
      withAsterisk: false,
      disabled: true,
    });
    const sampleNumberItem = globalText({
      colSpan: 6,
      name: 'sampleNumber',
      label: 'sampleNumber',
      withAsterisk: false,
    });
    const desc = globalText({
      colSpan: 12,
      name: 'desc',
      label: 'desc',
      withAsterisk: false,
    });

    const photo: ControllerProps = {
      control: 'image-dropzone',
      name: 'photos',
      label: 'documentation',
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
        handleRejectFile<IMutationRitageMoving>({
          methods,
          files,
          field: 'photos',
        }),
    };

    const checkerInformation = [
      fromCheckerName,
      fromCheckerPosition,
      toCheckerName,
      toCheckerPosition,
      shiftItem,
      materialItem,
      materialSubItem,
      hullNumber,
      hullNumberSubstitution,
      weatherItem,
    ];

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.date'),
        formControllers: [date],
      },
      {
        group: t('commonTypography.checkerInformation'),
        enableGroupLabel: true,
        formControllers: checkerInformation,
      },
      {
        group: t('commonTypography.ritageDuration'),
        enableGroupLabel: true,
        formControllers: [fromTime, arriveTime, ritageDurationItem],
      },
      {
        group: t('commonTypography.arrive'),
        enableGroupLabel: true,
        formControllers: [fromDomeIdItem, toDomeIdItem],
      },
      {
        group: t('commonTypography.detail'),
        enableGroupLabel: true,
        formControllers: [
          bulkSamplingDensityItem,
          bucketVolumeItem,
          tonByRitageItem,
          sampleNumberItem,
        ],
      },
      {
        group: t('commonTypography.desc'),
        formControllers: [desc],
      },
      {
        group: t('commonTypography.documentation'),
        formControllers: [photo],
      },
    ];

    isRitageProblematic ? field : field[1].formControllers.splice(8, 1);

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    movingRitage,
    isRitageProblematic,
    photos,
    serverPhotos,
    deletedPhotoIds,
  ]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationRitageMoving> = (data) => {
    const values = objectToArrayValue(data);
    const dateValue = ['date'];
    const numberValue = ['bucketVolume', 'bulkSamplingDensity'];
    const manipulateValue = values.map((val) => {
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
      id,
      data: manipulateValue,
      deletedPhotoIds,
    });
  };
  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={movingRitageLoading}>
      <GlobalFormGroup
        field={fieldRhf}
        methods={methods}
        submitForm={handleSubmitForm}
        switchProps={{
          label: 'problemRitage',
          switchItem: {
            checked: isRitageProblematic,
            onChange: (value) => {
              methods.setValue(
                'isRitageProblematic',
                value.currentTarget.checked
              ),
                methods.setValue('companyHeavyEquipmentChangeId', '');
            },
          },
        }}
        submitButton={{
          label: t('commonTypography.save'),
          type: 'button',
          onClick: async () => {
            const output = await methods.trigger(undefined, {
              shouldFocus: true,
            });
            if (output) setIsOpenConfirmation((prev) => !prev);
          },
        }}
        backButton={{
          onClick: () =>
            router.push('/input-data/production/data-ritage?tabs=moving'),
        }}
        modalConfirmation={{
          isOpenModalConfirmation: isOpenConfirmation,
          actionModalConfirmation: () => setIsOpenConfirmation((prev) => !prev),
          actionButton: {
            label: t('commonTypography.yes'),
            type: 'button',
            onClick: handleConfirmation,
            loading: isLoading,
          },
          backButton: {
            label: 'Batal',
          },
          modalType: {
            type: 'default',
            title: t('commonTypography.alertTitleConfirmUpdate'),
          },
          withDivider: true,
        }}
      />
    </DashboardCard>
  );
};

export default UpdateRitageMovingBook;
