import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadOneBlockPitMaster } from '@/services/graphql/query/block/useReadOneBlockPitMaster';
import { useReadOneOreRitage } from '@/services/graphql/query/ore-ritage/useReadOneOreRitage';
import { IMutationRitageOre } from '@/services/restapi/ritage-productions/ore/useCreateRitageOre';
import { useUpdateRitageOre } from '@/services/restapi/ritage-productions/ore/useUpdateRitageOre';
import {
  employeeSelect,
  globalDate,
  globalNumberInput,
  globalText,
  globalTimeInput,
  heavyEquipmentSelect,
  locationSelect,
  materialSelect,
  pitSelect,
  weatherSelect,
} from '@/utils/constants/Field/global-field';
import { shiftSelect } from '@/utils/constants/Field/sample-house-field';
import {
  domeNameSelect,
  stockpileNameSelect,
} from '@/utils/constants/Field/stockpile-field';
import { ritageOreMutationValidation } from '@/utils/form-validation/ritage/ritage-ore-validation';
import { sendGAEvent } from '@/utils/helper/analytics';
import { countTonByRitage } from '@/utils/helper/countTonByRitage';
import { formatDate } from '@/utils/helper/dateFormat';
import { dateToString, stringToDate } from '@/utils/helper/dateToString';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { hourDiff } from '@/utils/helper/hourDiff';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import { ControllerGroup, ControllerProps, IFile } from '@/types/global';

const UpdateRitageOreBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });
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
  const methods = useForm<IMutationRitageOre>({
    resolver: zodResolver(ritageOreMutationValidation),
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
      block: '',
      weatherId: '',
      fromPitId: '',
      fromFrontId: '',
      fromGridId: '',
      fromSequenceId: '',
      fromElevationId: '',
      fromLevel: '',
      toLevel: '',
      stockpileId: '',
      domeId: '',
      closeDome: false,
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
    shouldFocusError: true,
  });
  const fromPitId = methods.watch('fromPitId');
  const stockpileId = methods.watch('stockpileId');
  const photos = methods.watch('photos');
  const isRitageProblematic = methods.watch('isRitageProblematic');
  const closeDome = methods.watch('closeDome');

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
  const { oreRitage, oreRitageLoading } = useReadOneOreRitage({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: ({ oreRitage }) => {
      const ritageDate = stringToDate(oreRitage.date ?? null);
      const fromTime = formatDate(oreRitage.fromAt, 'HH:mm:ss');
      const arriveTime = formatDate(oreRitage.arriveAt, 'HH:mm:ss');
      methods.setValue('isRitageProblematic', oreRitage.isRitageProblematic);
      methods.setValue('date', ritageDate);
      methods.setValue('checkerFromId', oreRitage.checkerFrom?.id ?? '');
      methods.setValue(
        'checkerFromPosition',
        oreRitage.checkerFromPosition ?? ''
      );
      methods.setValue('checkerToId', oreRitage.checkerTo?.id ?? '');
      methods.setValue('checkerToPosition', oreRitage.checkerToPosition ?? '');
      methods.setValue('shiftId', oreRitage.shift?.id ?? '');
      methods.setValue(
        'companyHeavyEquipmentId',
        oreRitage.companyHeavyEquipment?.id ?? ''
      );
      methods.setValue(
        'companyHeavyEquipmentChangeId',
        oreRitage.companyHeavyEquipmentChange?.id ?? ''
      );
      methods.setValue('materialId', oreRitage.material?.id ?? '');
      methods.setValue('subMaterialId', oreRitage.subMaterial?.id ?? '');
      methods.setValue('fromTime', fromTime ?? '');
      setNewFromTime(fromTime ?? '');
      methods.setValue('arriveTime', arriveTime ?? '');
      setNewArriveTime(arriveTime ?? '');
      methods.setValue('weatherId', oreRitage.weather?.id ?? '');
      methods.setValue('fromPitId', oreRitage.fromPit?.id ?? '');
      methods.setValue('fromElevationId', oreRitage.fromElevation?.id ?? '');
      methods.setValue('fromGridId', oreRitage.fromGrid?.id ?? '');
      methods.setValue('fromFrontId', oreRitage.fromFront?.id ?? '');
      methods.setValue('fromSequenceId', oreRitage.fromSequence?.id ?? '');
      methods.setValue('fromLevel', oreRitage.fromLevel ?? '');
      methods.setValue('toLevel', oreRitage.toLevel ?? '');
      methods.setValue('stockpileId', oreRitage.stockpile?.id ?? '');
      methods.setValue('domeId', oreRitage.dome?.id ?? '');
      methods.setValue('closeDome', oreRitage.closeDome ?? false);
      methods.setValue(
        'bulkSamplingDensity',
        oreRitage.bulkSamplingDensity ?? ''
      );
      setNewBulkSamplingDensity(`${oreRitage.bulkSamplingDensity ?? ''}`);
      methods.setValue('bucketVolume', oreRitage.bucketVolume ?? '');
      setNewBucketVolume(`${oreRitage.bucketVolume ?? ''}`);
      methods.setValue('sampleNumber', oreRitage.sampleNumber ?? '');
      methods.setValue('desc', oreRitage.desc ?? '');
      setServerPhotos(oreRitage.photos ?? []);
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
    fetchPolicy: 'cache-first',
  });

  const { mutate, isLoading } = useUpdateRitageOre({
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
          category: 'Produksi',
          subSubCategory: '',
          subCategory: 'Produksi - Data Ritase - Ore',
          account: userAuthData?.email ?? '',
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('ritageOre.successUpdateMessage'),
        icon: <IconCheck />,
      });
      setIsOpenConfirmation((prev) => !prev);
      methods.reset();
      router.push('/input-data/production/data-ritage?tabs=ore');
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
      withAsterisk: false,
      positionId: `${process.env.NEXT_PUBLIC_EMPLOYEE_CHECKER_ID}`,
      defaultValue: oreRitage?.checkerFrom?.id,
      labelValue: oreRitage?.checkerFrom?.humanResource?.name,
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
      defaultValue: oreRitage?.checkerTo?.id,
      labelValue: oreRitage?.checkerTo?.humanResource?.name,
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
      defaultValue: oreRitage?.companyHeavyEquipment?.id,
      labelValue: oreRitage?.companyHeavyEquipment?.hullNumber ?? '',
    });
    const hullNumberSubstitution = heavyEquipmentSelect({
      colSpan: 6,
      name: 'companyHeavyEquipmentChangeId',
      label: 'heavyEquipmentCodeSubstitution',
      withAsterisk: true,
      categoryId: `${process.env.NEXT_PUBLIC_DUMP_TRUCK_ID}`,
      defaultValue: oreRitage?.companyHeavyEquipmentChange?.id,
      labelValue: oreRitage?.companyHeavyEquipmentChange?.hullNumber ?? '',
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
      defaultValue: oreRitage?.fromPit?.id,
      labelValue: oreRitage?.fromPit?.name,
    });
    const frontItem = locationSelect({
      colSpan: 6,
      name: 'fromFrontId',
      label: 'fromFront',
      withAsterisk: false,
      categoryIds: [`${process.env.NEXT_PUBLIC_FRONT_ID}`],
      defaultValue: oreRitage?.fromFront?.id,
      labelValue: oreRitage?.fromFront?.name,
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
      categoryIds: [`${process.env.NEXT_PUBLIC_GRID_ID}`],
      defaultValue: oreRitage?.fromGrid?.id,
      labelValue: oreRitage?.fromGrid?.name,
    });
    const sequenceItem = locationSelect({
      colSpan: 6,
      name: 'fromSequenceId',
      label: 'fromSequence',
      withAsterisk: false,
      categoryIds: [`${process.env.NEXT_PUBLIC_SEQUENCE_ID}`],
      defaultValue: oreRitage?.fromSequence?.id,
      labelValue: oreRitage?.fromSequence?.name,
    });
    const elevasiItem = locationSelect({
      colSpan: 6,
      name: 'fromElevationId',
      label: 'fromElevasi',
      withAsterisk: false,
      categoryIds: [`${process.env.NEXT_PUBLIC_ELEVASI_ID}`],
      defaultValue: oreRitage?.fromElevation?.id,
      labelValue: oreRitage?.fromElevation?.name,
    });
    const fromLevel = globalText({
      colSpan: 6,
      name: 'fromLevel',
      label: 'fromLevel',
      withAsterisk: false,
    });
    const toLevel = globalText({
      colSpan: 6,
      name: 'toLevel',
      label: 'toLevel',
      withAsterisk: false,
    });
    const newStockpileId = stockpileId || null;
    const stockpileItem = stockpileNameSelect({
      colSpan: 6,
      name: 'stockpileId',
      label: 'stockpileName',
      withAsterisk: false,
      defaultValue: oreRitage?.stockpile?.id,
      labelValue: oreRitage?.stockpile?.name,
      onChange: (value) => {
        methods.setValue('stockpileId', value ?? '');
        methods.setValue('domeId', '');
        methods.trigger('stockpileId');
        methods.trigger('domeId');
      },
    });
    const domeItem = domeNameSelect({
      colSpan: 6,
      name: 'domeId',
      label: 'domeName',
      stockpileId: stockpileId,
      withAsterisk: false,
      disabled: !newStockpileId,
      defaultValue: oreRitage?.dome?.id,
      labelValue: oreRitage?.dome?.name,
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
        handleRejectFile<IMutationRitageOre>({
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
        group: t('commonTypography.level'),
        enableGroupLabel: true,
        formControllers: [fromLevel, toLevel],
      },
      {
        group: t('commonTypography.arrive'),
        enableGroupLabel: true,
        groupCheckbox: {
          onChange: () => {
            closeDome === true
              ? methods.setValue('closeDome', false)
              : methods.setValue('closeDome', true);
          },
          checked: closeDome,
          label: t('commonTypography.closeDome'),
        },
        formControllers: [stockpileItem, domeItem],
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
    oreRitage,
    isRitageProblematic,
    photos,
    serverPhotos,
    deletedPhotoIds,
    closeDome,
    stockpileId,
  ]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationRitageOre> = (data) => {
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
    <DashboardCard p={0} isLoading={oreRitageLoading}>
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
            router.push('/input-data/production/data-ritage?tabs=ore'),
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

export default UpdateRitageOreBook;
