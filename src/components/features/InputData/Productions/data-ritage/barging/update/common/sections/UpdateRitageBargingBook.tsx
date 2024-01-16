import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadOneBargingRitage } from '@/services/graphql/query/barging-ritage/useReadOneBargingRitage';
import { useReadOneStockpileDomeMaster } from '@/services/graphql/query/stockpile-master/useReadOneStockpileDomeMaster';
import { IMutationRitageBarging } from '@/services/restapi/ritage-productions/barging/useCreateRitageBarging';
import { useUpdateRitageBarging } from '@/services/restapi/ritage-productions/barging/useUpdateRitageBarging';
import {
  employeeSelect,
  globalDate,
  globalNumberInput,
  globalText,
  globalTimeInput,
  heavyEquipmentSelect,
  locationSelect,
  materialSelect,
  weatherSelect,
} from '@/utils/constants/Field/global-field';
import { shiftSelect } from '@/utils/constants/Field/sample-house-field';
import { domeNameSelect } from '@/utils/constants/Field/stockpile-field';
import { ritageBargingMutationValidation } from '@/utils/form-validation/ritage/ritage-barging-validation';
import { countTonByRitage } from '@/utils/helper/countTonByRitage';
import { formatDate } from '@/utils/helper/dateFormat';
import { dateToString, stringToDate } from '@/utils/helper/dateToString';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { hourDiff } from '@/utils/helper/hourDiff';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import { ControllerGroup, ControllerProps, IFile } from '@/types/global';

const UpdateRitageBargingBook = () => {
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
  const methods = useForm<IMutationRitageBarging>({
    resolver: zodResolver(ritageBargingMutationValidation),
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
      subMaterialId: '',
      fromTime: '',
      arriveTime: '',
      ritageDuration: '',
      weatherId: '',
      domeId: '',
      stockpileName: '',
      bargingId: '',
      closeDome: false,
      bargeCompanyHeavyEquipmentId: '',
      bulkSamplingDensity: '',
      bucketVolume: '',
      tonByRitage: '',
      sampleNumber: '',
      desc: '',
      photos: [],
      isRitageProblematic: false,
    },
    mode: 'onBlur',
  });
  const materialId = methods.watch('materialId');
  const domeId = methods.watch('domeId');
  const photos = methods.watch('photos');
  const isRitageProblematic = methods.watch('isRitageProblematic');
  const closeDome = methods.watch('closeDome');

  React.useEffect(() => {
    const ritageDuration = hourDiff(newFromTime, newArriveTime);
    const amount = countTonByRitage(newBucketVolume, newBulkSamplingDensity);
    methods.setValue('tonByRitage', `${!amount ? '' : amount}`);
    methods.setValue('ritageDuration', ritageDuration ?? '');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newFromTime, newArriveTime, newBulkSamplingDensity, newBucketVolume]);

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { bargingRitage, bargingRitageLoading } = useReadOneBargingRitage({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: ({ bargingRitage }) => {
      const ritageDate = stringToDate(bargingRitage.date ?? null);
      const fromTime = formatDate(bargingRitage.fromAt, 'HH:mm:ss');
      const arriveTime = formatDate(bargingRitage.arriveAt, 'HH:mm:ss');
      methods.setValue(
        'isRitageProblematic',
        bargingRitage.isRitageProblematic
      );
      methods.setValue('date', ritageDate);
      methods.setValue('checkerFromId', bargingRitage.checkerFrom?.id ?? '');
      methods.setValue(
        'checkerFromPosition',
        bargingRitage.checkerFromPosition ?? ''
      );
      methods.setValue('checkerToId', bargingRitage.checkerTo?.id ?? '');
      methods.setValue(
        'checkerToPosition',
        bargingRitage.checkerToPosition ?? ''
      );
      methods.setValue('shiftId', bargingRitage.shift?.id ?? '');
      methods.setValue(
        'companyHeavyEquipmentId',
        bargingRitage.companyHeavyEquipment?.id ?? ''
      );
      methods.setValue(
        'companyHeavyEquipmentChangeId',
        bargingRitage.companyHeavyEquipmentChange?.id ?? ''
      );
      methods.setValue('materialId', bargingRitage.material?.id ?? '');
      methods.setValue('subMaterialId', bargingRitage.subMaterial?.id ?? '');
      methods.setValue('fromTime', fromTime ?? '');
      setNewFromTime(fromTime ?? '');
      methods.setValue('arriveTime', arriveTime ?? '');
      setNewArriveTime(arriveTime ?? '');
      methods.setValue('weatherId', bargingRitage.weather?.id ?? '');
      methods.setValue('domeId', bargingRitage.dome?.id ?? '');
      methods.setValue('bargingId', bargingRitage.barging?.id ?? '');
      methods.setValue('closeDome', bargingRitage.closeDome ?? false);
      methods.setValue(
        'bargeCompanyHeavyEquipmentId',
        bargingRitage.bargeCompanyHeavyEquipment?.id ?? ''
      );
      methods.setValue(
        'bulkSamplingDensity',
        bargingRitage.bulkSamplingDensity ?? ''
      );
      setNewBulkSamplingDensity(`${bargingRitage.bulkSamplingDensity ?? ''}`);
      methods.setValue('bucketVolume', bargingRitage.bucketVolume ?? '');
      setNewBucketVolume(`${bargingRitage.bucketVolume ?? ''}`);
      methods.setValue('sampleNumber', bargingRitage.sampleNumber ?? '');
      methods.setValue('desc', bargingRitage.desc ?? '');
      setServerPhotos(bargingRitage.photos ?? []);
    },
  });
  useReadOneStockpileDomeMaster({
    variables: {
      id: domeId as string,
    },
    skip: domeId === '' || !domeId,
    onCompleted: ({ dome }) => {
      methods.setValue('stockpileName', dome.stockpile.name);
    },
  });

  const { mutate, isLoading } = useUpdateRitageBarging({
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
        message: t('ritageBarging.successUpdateMessage'),
        icon: <IconCheck />,
      });
      setIsOpenConfirmation((prev) => !prev);
      methods.reset();
      router.push('/input-data/production/data-ritage?tabs=barging');
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
      defaultValue: bargingRitage?.checkerFrom?.id,
      labelValue: bargingRitage?.checkerFrom?.humanResource?.name,
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
      defaultValue: bargingRitage?.checkerTo?.id,
      labelValue: bargingRitage?.checkerTo?.humanResource?.name,
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
      defaultValue: bargingRitage?.companyHeavyEquipment?.id,
      labelValue: bargingRitage?.companyHeavyEquipment?.hullNumber ?? '',
    });
    const hullNumberSubstitution = heavyEquipmentSelect({
      colSpan: 6,
      name: 'companyHeavyEquipmentChangeId',
      label: 'heavyEquipmentCodeSubstitution',
      withAsterisk: true,
      categoryId: `${process.env.NEXT_PUBLIC_DUMP_TRUCK_ID}`,
      defaultValue: bargingRitage?.companyHeavyEquipmentChange?.id,
      labelValue: bargingRitage?.companyHeavyEquipmentChange?.hullNumber ?? '',
    });
    const materialItem = materialSelect({
      colSpan: 6,
      name: 'materialId',
      label: 'material',
      withAsterisk: true,
      onChange: (value) => {
        methods.setValue('materialId', value ?? '');
        methods.setValue('subMaterialId', '');
        methods.trigger('materialId');
      },
    });
    const newMaterialId = materialId === '' ? null : materialId;
    const materialSubItem = materialSelect({
      colSpan: 6,
      name: 'subMaterialId',
      label: 'subMaterial',
      withAsterisk: false,
      disabled: !newMaterialId,
      parentId: materialId,
      isHaveParent: true,
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
    const stockpileItem = globalText({
      colSpan: 6,
      name: 'stockpileName',
      label: 'fromStockpile',
      withAsterisk: false,
      disabled: true,
    });
    const domeItem = domeNameSelect({
      colSpan: 6,
      name: 'domeId',
      label: 'domeName',
      withAsterisk: false,
      defaultValue: bargingRitage?.dome?.id,
      labelValue: bargingRitage?.dome?.name,
    });
    const bargingItem = locationSelect({
      colSpan: 6,
      name: 'bargingId',
      label: 'toBarging',
      withAsterisk: false,
      categoryId: `${process.env.NEXT_PUBLIC_BARGING_ID}`,
      defaultValue: bargingRitage?.barging?.id,
      labelValue: bargingRitage?.barging?.name,
    });
    const bargeCodeItem = heavyEquipmentSelect({
      colSpan: 6,
      name: 'bargeCompanyHeavyEquipmentId',
      label: 'bargeCode',
      withAsterisk: false,
      categoryId: `${process.env.NEXT_PUBLIC_BARGE_ID}`,
      defaultValue: bargingRitage?.bargeCompanyHeavyEquipment?.id,
      labelValue: bargingRitage?.bargeCompanyHeavyEquipment?.hullNumber ?? '',
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
        handleRejectFile<IMutationRitageBarging>({
          methods,
          files,
          field: 'photos',
        }),
    };

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.date'),
        formControllers: [date],
      },
      {
        group: t('commonTypography.checkerInformation'),
        enableGroupLabel: true,
        formControllers: [
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
        ],
      },
      {
        group: t('commonTypography.ritageDuration'),
        enableGroupLabel: true,
        formControllers: [fromTime, arriveTime, ritageDurationItem],
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
        formControllers: [domeItem, stockpileItem, bargingItem, bargeCodeItem],
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
    bargingRitage,
    isRitageProblematic,
    photos,
    serverPhotos,
    deletedPhotoIds,
    materialId,
    closeDome,
  ]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationRitageBarging> = (data) => {
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
    <DashboardCard p={0} isLoading={bargingRitageLoading}>
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
            router.push('/input-data/production/data-ritage?tabs=barging'),
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

export default UpdateRitageBargingBook;
