import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadOneBlockPitMaster } from '@/services/graphql/query/block/useReadOneBlockPitMaster';
import { useReadOneTopsoilRitage } from '@/services/graphql/query/topsoil-ritage/useReadOneTopsoilRitage';
import { IMutationRitageTopsoil } from '@/services/restapi/ritage-productions/topsoil/useCreateRitageTopsoil';
import { useUpdateRitageTopsoil } from '@/services/restapi/ritage-productions/topsoil/useUpdateRitageTopsoil';
import {
  employeeSelect,
  globalDate,
  globalNumberInput,
  globalText,
  globalTimeInput,
  heavyEquipmentSelect,
  locationCategorySelect,
  locationSelect,
  materialSelect,
  pitSelect,
  weatherSelect,
} from '@/utils/constants/Field/global-field';
import { shiftSelect } from '@/utils/constants/Field/sample-house-field';
import { ritageTopsoilMutationValidation } from '@/utils/form-validation/ritage/ritage-topsoil-validation';
import { countTonByRitage } from '@/utils/helper/countTonByRitage';
import { formatDate2 } from '@/utils/helper/dateFormat';
import { dateToString, stringToDate } from '@/utils/helper/dateToString';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { hourDiff } from '@/utils/helper/hourDiff';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import { ControllerGroup, ControllerProps, IFile } from '@/types/global';

const UpdateRitageTopsoilBook = () => {
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
  const methods = useForm<IMutationRitageTopsoil>({
    resolver: zodResolver(ritageTopsoilMutationValidation),
    defaultValues: {
      date: undefined,
      checkerFromId: '',
      checkerFromPosition: '',
      checkerToId: '',
      checkerToPosition: '',
      shiftId: '',
      companyHeavyEquipmentId: '',
      companyHeavyEquipmentChangeId: '',
      materialId: '',
      fromTime: '',
      arriveTime: '',
      ritageDuration: '',
      block: '',
      weatherId: '',
      fromPitId: '',
      fromFrontId: '',
      fromGridId: '',
      fromSequenceId: '',
      fromElevationId: '',
      toLocationCategoryId: '',
      toLocationId: '',
      bulkSamplingDensity: '',
      bucketVolume: '',
      tonByRitage: '',
      desc: '',
      photos: [],
      isRitageProblematic: false,
    },
    mode: 'onBlur',
  });
  const toLocationCategoryId = methods.watch('toLocationCategoryId');
  const fromPitId = methods.watch('fromPitId');
  const photos = methods.watch('photos');
  const isRitageProblematic = methods.watch('isRitageProblematic');

  React.useEffect(() => {
    const ritageDuration = hourDiff(newFromTime, newArriveTime);
    const amount = countTonByRitage(newBucketVolume, newBulkSamplingDensity);
    methods.setValue('tonByRitage', `${!amount ? '' : amount}`);
    methods.setValue('ritageDuration', ritageDuration ?? '');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newFromTime, newArriveTime, newBulkSamplingDensity, newBucketVolume]);

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { topsoilRitage, topsoilRitageLoading } = useReadOneTopsoilRitage({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: ({ topsoilRitage }) => {
      const ritageDate = stringToDate(topsoilRitage.date ?? null);
      const fromTime = formatDate2(topsoilRitage.fromAt, 'HH:mm:ss');
      const arriveTime = formatDate2(topsoilRitage.arriveAt, 'HH:mm:ss');
      methods.setValue(
        'isRitageProblematic',
        topsoilRitage.isRitageProblematic
      );
      methods.setValue('date', ritageDate);
      methods.setValue('checkerFromId', topsoilRitage.checkerFrom?.id ?? '');
      methods.setValue(
        'checkerFromPosition',
        topsoilRitage.checkerFromPosition ?? ''
      );
      methods.setValue('checkerToId', topsoilRitage.checkerTo?.id ?? '');
      methods.setValue(
        'checkerToPosition',
        topsoilRitage.checkerToPosition ?? ''
      );
      methods.setValue('shiftId', topsoilRitage.shift?.id ?? '');
      methods.setValue(
        'companyHeavyEquipmentId',
        topsoilRitage.companyHeavyEquipment?.id ?? ''
      );
      methods.setValue(
        'companyHeavyEquipmentChangeId',
        topsoilRitage.companyHeavyEquipmentChange?.id ?? ''
      );
      methods.setValue('materialId', topsoilRitage.material?.id ?? '');
      methods.setValue('fromTime', fromTime ?? '');
      setNewFromTime(fromTime ?? '');
      methods.setValue('arriveTime', arriveTime ?? '');
      setNewArriveTime(arriveTime ?? '');
      methods.setValue('weatherId', topsoilRitage.weather?.id ?? '');
      methods.setValue('fromPitId', topsoilRitage.fromPit?.id ?? '');
      methods.setValue(
        'fromElevationId',
        topsoilRitage.fromElevation?.id ?? ''
      );
      methods.setValue('fromGridId', topsoilRitage.fromGrid?.id ?? '');
      methods.setValue('fromFrontId', topsoilRitage.fromFront?.id ?? '');
      methods.setValue('fromSequenceId', topsoilRitage.fromSequence?.id ?? '');
      methods.setValue(
        'toLocationCategoryId',
        topsoilRitage.toLocationCategory?.id ?? ''
      );
      methods.setValue('toLocationId', topsoilRitage.toLocation?.id ?? '');
      methods.setValue(
        'bulkSamplingDensity',
        topsoilRitage.bulkSamplingDensity ?? ''
      );
      setNewBulkSamplingDensity(`${topsoilRitage.bulkSamplingDensity ?? ''}`);
      methods.setValue('bucketVolume', topsoilRitage.bucketVolume ?? '');
      setNewBucketVolume(`${topsoilRitage.bucketVolume ?? ''}`);
      methods.setValue('desc', topsoilRitage.desc ?? '');
      setServerPhotos(topsoilRitage.photos ?? []);
    },
  });
  useReadOneBlockPitMaster({
    variables: {
      id: fromPitId as string,
    },
    skip: fromPitId === '' || !fromPitId,
    onCompleted: ({ pit }) => {
      methods.setValue('block', pit.block.name);
    },
  });

  const { mutate, isLoading } = useUpdateRitageTopsoil({
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
        message: t('ritageTopsoil.successUpdateMessage'),
        icon: <IconCheck />,
      });
      setIsOpenConfirmation((prev) => !prev);
      methods.reset();
      router.push('/input-data/production/data-ritage?tabs=topsoil');
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
      defaultValue: topsoilRitage?.checkerFrom?.id,
      labelValue: topsoilRitage?.checkerFrom?.humanResource?.name,
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
      defaultValue: topsoilRitage?.checkerTo?.id,
      labelValue: topsoilRitage?.checkerTo?.humanResource?.name,
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
      defaultValue: topsoilRitage?.companyHeavyEquipment?.id,
      labelValue: topsoilRitage?.companyHeavyEquipment?.hullNumber ?? '',
    });
    const hullNumberSubstitution = heavyEquipmentSelect({
      colSpan: 6,
      name: 'companyHeavyEquipmentChangeId',
      label: 'heavyEquipmentCodeSubstitution',
      withAsterisk: true,
      categoryId: `${process.env.NEXT_PUBLIC_DUMP_TRUCK_ID}`,
      defaultValue: topsoilRitage?.companyHeavyEquipmentChange?.id,
      labelValue: topsoilRitage?.companyHeavyEquipmentChange?.hullNumber ?? '',
    });
    const materialItem = materialSelect({
      colSpan: 6,
      name: 'materialId',
      label: 'material',
      withAsterisk: true,
      disabled: true,
      includeIds: [`${process.env.NEXT_PUBLIC_MATERIAL_TOPSOIL_ID}`],
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
    const pitItem = pitSelect({
      colSpan: 6,
      name: 'fromPitId',
      label: 'fromPit',
      withAsterisk: true,
      onChange: (value) => {
        methods.setValue('fromPitId', value ?? '');
        methods.setValue('block', '');
        methods.trigger('fromPitId');
      },
      defaultValue: topsoilRitage?.fromPit?.id,
      labelValue: topsoilRitage?.fromPit?.name,
    });
    const frontItem = locationSelect({
      colSpan: 6,
      name: 'fromFrontId',
      label: 'fromFront',
      withAsterisk: false,
      categoryId: `${process.env.NEXT_PUBLIC_FRONT_ID}`,
      defaultValue: topsoilRitage?.fromFront?.id,
      labelValue: topsoilRitage?.fromFront?.name,
    });
    const block = globalText({
      colSpan: 6,
      name: 'block',
      label: 'fromBlock',
      withAsterisk: false,
      disabled: true,
    });
    const gridItem = locationSelect({
      colSpan: 6,
      name: 'fromGridId',
      label: 'fromGrid',
      withAsterisk: false,
      categoryId: `${process.env.NEXT_PUBLIC_GRID_ID}`,
      defaultValue: topsoilRitage?.fromGrid?.id,
      labelValue: topsoilRitage?.fromGrid?.name,
    });
    const sequenceItem = locationSelect({
      colSpan: 6,
      name: 'fromSequenceId',
      label: 'fromSequence',
      withAsterisk: false,
      categoryId: `${process.env.NEXT_PUBLIC_SEQUENCE_ID}`,
      defaultValue: topsoilRitage?.fromSequence?.id,
      labelValue: topsoilRitage?.fromSequence?.name,
    });
    const elevasiItem = locationSelect({
      colSpan: 6,
      name: 'fromElevationId',
      label: 'fromElevasi',
      withAsterisk: false,
      categoryId: `${process.env.NEXT_PUBLIC_ELEVASI_ID}`,
      defaultValue: topsoilRitage?.fromElevation?.id,
      labelValue: topsoilRitage?.fromElevation?.name,
    });
    const locationCategoryItem = locationCategorySelect({
      clearable: true,
      withAsterisk: false,
      name: 'toLocationCategoryId',
      defaultValue: topsoilRitage?.toLocationCategory?.id,
      labelValue: topsoilRitage?.toLocationCategory?.name,
      onChange: (value) => {
        methods.setValue('toLocationCategoryId', value ?? '');
        methods.setValue('toLocationId', '');
        methods.trigger('toLocationCategoryId');
      },
    });
    const newToLocationCategoryId =
      toLocationCategoryId === '' ? null : toLocationCategoryId;
    const locationItem = locationSelect({
      colSpan: 6,
      name: 'toLocationId',
      label: 'locationName',
      withAsterisk: false,
      defaultValue: topsoilRitage?.toLocation?.id,
      labelValue: topsoilRitage?.toLocation?.name,
      disabled: !newToLocationCategoryId,
      categoryId: toLocationCategoryId,
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
        handleRejectFile<IMutationRitageTopsoil>({
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
        group: t('commonTypography.location'),
        enableGroupLabel: true,
        formControllers: [
          pitItem,
          frontItem,
          block,
          gridItem,
          sequenceItem,
          elevasiItem,
        ],
      },
      {
        group: t('commonTypography.arrive'),
        enableGroupLabel: true,
        formControllers: [locationCategoryItem, locationItem],
      },
      {
        group: t('commonTypography.detail'),
        enableGroupLabel: true,
        formControllers: [
          bulkSamplingDensityItem,
          bucketVolumeItem,
          tonByRitageItem,
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

    isRitageProblematic ? field : field[1].formControllers.splice(7, 1);

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    topsoilRitage,
    isRitageProblematic,
    photos,
    serverPhotos,
    deletedPhotoIds,
    toLocationCategoryId,
  ]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationRitageTopsoil> = (data) => {
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
    <DashboardCard p={0} isLoading={topsoilRitageLoading}>
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
          onClick: () => setIsOpenConfirmation((prev) => !prev),
        }}
        backButton={{
          onClick: () =>
            router.push('/input-data/production/data-ritage?tabs=topsoil'),
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

export default UpdateRitageTopsoilBook;
