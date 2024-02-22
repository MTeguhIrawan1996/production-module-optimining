import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadOneShippingMonitoring } from '@/services/graphql/query/shipping-monitoring/useReadOneShippingMonitoring';
import {
  IMutationShippingMonitoringValues,
  IShippingMonitoringNameProps,
  IShippingMonitoringValueProps,
} from '@/services/restapi/shipping-monitoring/useCreateShippingMonitoring';
import { useUpdateShippingMonitoring } from '@/services/restapi/shipping-monitoring/useUpdateShippingMonitoring';
import {
  globalDate,
  globalSelectArriveBargeRhf,
  globalSelectFactoryRhf,
  globalText,
  globalTimeInput,
  heavyEquipmentSelect,
} from '@/utils/constants/Field/global-field';
import { shippingMonitoringMutationValidation } from '@/utils/form-validation/shipping-monitoring/shipping-monitoring-mutation-validation';
import { formatDate } from '@/utils/helper/dateFormat';
import { dateToString, stringToDate } from '@/utils/helper/dateToString';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import {
  ControllerGroup,
  ControllerProps,
  IFile,
  IReadOneValueMapping,
} from '@/types/global';

const UpdateShippingMonitoringBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [serverPhoto, setServerPhoto] = React.useState<
    Omit<IFile, 'mime' | 'path'>[] | null
  >([]);
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationShippingMonitoringValues>({
    resolver: zodResolver(shippingMonitoringMutationValidation),
    defaultValues: {
      bargeHeavyEquipmentId: '',
      tugboatHeavyEquipmentId: '',
      palkaOpenDate: undefined,
      palkaOpenTime: '',
      palkaCloseDate: undefined,
      palkaCloseTime: '',
      factoryCategoryId: '',
      factoryId: '',
      vesselOpenDate: undefined,
      vesselOpenTime: '',
      vesselCloseDate: undefined,
      vesselCloseTime: '',
      desc: '',
      photo: [],
    },
    mode: 'onBlur',
  });
  const factoryCategoryId = methods.watch('factoryCategoryId');
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { monitoringBarging, monitoringBargingLoading } =
    useReadOneShippingMonitoring({
      variables: {
        id,
      },
      skip: !router.isReady,
      onCompleted: ({ monitoringBarging }) => {
        const dateFields = [
          'palkaOpenAt',
          'palkaCloseAt',
          'vesselOpenAt',
          'vesselCloseAt',
        ];
        const valueMappings: IReadOneValueMapping<
          IShippingMonitoringNameProps,
          IShippingMonitoringValueProps
        >[] = [
          {
            key: 'bargeHeavyEquipmentId',
            value: monitoringBarging.bargeHeavyEquipment?.id ?? '',
          },
          {
            key: 'tugboatHeavyEquipmentId',
            value: monitoringBarging.tugboatHeavyEquipment?.id ?? '',
          },
          {
            key: 'factoryCategoryId',
            value: monitoringBarging.factory?.category?.id ?? '',
          },
          { key: 'factoryId', value: monitoringBarging.factory?.id ?? '' },
          { key: 'desc', value: monitoringBarging.desc ?? '' },
        ];

        const setValue = (
          key: IShippingMonitoringNameProps,
          value: IShippingMonitoringValueProps
        ) => methods.setValue(key, value);

        dateFields.forEach((field) => {
          const date = stringToDate(monitoringBarging[field] ?? null);
          const time = formatDate(monitoringBarging[field], 'HH:mm:ss');
          setValue(
            `${field.slice(0, -2)}Date` as IShippingMonitoringNameProps,
            date ?? null
          );
          setValue(
            `${field.slice(0, -2)}Time` as IShippingMonitoringNameProps,
            time ?? ''
          );
        });
        valueMappings.forEach((mapping) => {
          setValue(mapping.key, mapping.value);
        });
        if (monitoringBarging.photo) {
          setServerPhoto([monitoringBarging.photo]);
        }
      },
    });
  const { mutate, isLoading } = useUpdateShippingMonitoring({
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
        message: t('shippingMonitoring.successUpdateMessage'),
        icon: <IconCheck />,
      });
      router.push('/input-data/quality-control-management/shipping-monitoring');
      methods.reset();
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */

  const fieldRhf = React.useMemo(() => {
    const isVessel = factoryCategoryId === process.env.NEXT_PUBLIC_VESSEL_ID;
    const bargeCodeItem = heavyEquipmentSelect({
      colSpan: 6,
      name: 'bargeHeavyEquipmentId',
      label: 'bargeCode',
      withAsterisk: true,
      categoryId: `${process.env.NEXT_PUBLIC_BARGE_ID}`,
      labelValue: monitoringBarging?.bargeHeavyEquipment?.hullNumber,
      defaultValue: monitoringBarging?.bargeHeavyEquipment?.id,
    });
    const tugBoatCodeItem = heavyEquipmentSelect({
      colSpan: 6,
      name: 'tugboatHeavyEquipmentId',
      label: 'tugboatCode',
      withAsterisk: false,
      categoryId: `${process.env.NEXT_PUBLIC_TUGBOAT_ID}`,
      labelValue: monitoringBarging?.tugboatHeavyEquipment?.hullNumber,
      defaultValue: monitoringBarging?.tugboatHeavyEquipment?.id,
    });
    const palkaOpenDate = globalDate({
      name: 'palkaOpenDate',
      label: 'openPalka',
      clearable: true,
      withAsterisk: false,
      colSpan: 6,
    });
    const palkaOpenTime = globalTimeInput({
      name: 'palkaOpenTime',
      label: 'openPalkaHour',
      colSpan: 6,
      withAsterisk: false,
    });
    const palkaCloseDate = globalDate({
      name: 'palkaCloseDate',
      label: 'closePalka',
      clearable: true,
      withAsterisk: false,
      colSpan: 6,
    });
    const palkaCloseTime = globalTimeInput({
      name: 'palkaCloseTime',
      label: 'closePalkaHour',
      colSpan: 6,
      withAsterisk: false,
    });
    const vesselOpenDate = globalDate({
      name: 'vesselOpenDate',
      label: 'openVessel',
      clearable: true,
      withAsterisk: false,
      colSpan: 6,
      disabled: !isVessel,
    });
    const vesselOpenTime = globalTimeInput({
      name: 'vesselOpenTime',
      label: 'openVesselHour',
      colSpan: 6,
      withAsterisk: false,
      disabled: !isVessel,
    });
    const vesselCloseDate = globalDate({
      name: 'vesselCloseDate',
      label: 'closeVessel',
      clearable: true,
      withAsterisk: false,
      colSpan: 6,
      disabled: !isVessel,
    });
    const vesselCloseTime = globalTimeInput({
      name: 'vesselCloseTime',
      label: 'closeVesselHour',
      colSpan: 6,
      withAsterisk: false,
      disabled: !isVessel,
    });
    const desc = globalText({
      colSpan: 12,
      name: 'desc',
      label: 'desc',
      withAsterisk: false,
    });
    const arriveItem = globalSelectArriveBargeRhf({
      name: 'factoryCategoryId',
      label: 'arrive',
      colSpan: 6,
      withAsterisk: true,
      onChange: (value) => {
        methods.setValue('factoryCategoryId', value ?? '');
        methods.setValue('factoryId', '');
        methods.setValue('vesselOpenDate', null);
        methods.setValue('vesselCloseDate', null);
        methods.setValue('vesselOpenTime', '');
        methods.setValue('vesselCloseTime', '');
        methods.trigger('factoryCategoryId');
      },
    });
    const newFactoryCategoryId =
      factoryCategoryId === '' ? null : factoryCategoryId;
    const factoryItem = globalSelectFactoryRhf({
      colSpan: 6,
      name: 'factoryId',
      label: 'vesselNameOrFactoryName',
      withAsterisk: false,
      disabled: !newFactoryCategoryId,
      categoryId: newFactoryCategoryId,
      labelValue: monitoringBarging?.factory?.name,
      defaultValue: monitoringBarging?.factory?.id,
    });

    const photo: ControllerProps = {
      control: 'image-dropzone',
      name: 'photo',
      label: 'photo',
      description: 'photoDescription',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      multiple: false,
      enableDeletePhoto: true,
      serverPhotos: serverPhoto,
      handleDeleteServerPhotos: () => {
        setServerPhoto([]);
      },
      onDrop: (value) => {
        methods.setValue('photo', value);
        methods.clearErrors('photo');
        setServerPhoto([]);
      },
      onReject: (files) =>
        handleRejectFile<IMutationShippingMonitoringValues>({
          methods,
          files,
          field: 'photo',
        }),
    };

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.shippingInformation'),
        enableGroupLabel: true,
        formControllers: [bargeCodeItem, tugBoatCodeItem],
      },
      {
        group: t('commonTypography.palkaTime'),
        enableGroupLabel: true,
        formControllers: [
          palkaOpenDate,
          palkaCloseDate,
          palkaOpenTime,
          palkaCloseTime,
        ],
      },
      {
        group: t('commonTypography.arrive'),
        enableGroupLabel: true,
        formControllers: [arriveItem, factoryItem],
      },
      {
        group: t('commonTypography.timeVesselGate'),
        enableGroupLabel: true,
        formControllers: [
          vesselOpenDate,
          vesselCloseDate,
          vesselOpenTime,
          vesselCloseTime,
        ],
      },
      {
        group: t('commonTypography.desc'),
        enableGroupLabel: false,
        formControllers: [desc],
      },
      {
        group: t('commonTypography.photo'),
        formControllers: [photo],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monitoringBarging, serverPhoto, factoryCategoryId]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationShippingMonitoringValues> = (
    data
  ) => {
    const values = objectToArrayValue(data);
    const dateValue = [
      'palkaOpenDate',
      'palkaCloseDate',
      'vesselOpenDate',
      'vesselCloseDate',
    ];

    const manipulateValue = values.map((val) => {
      if (dateValue.includes(val.name)) {
        const date = dateToString(val.value);
        return {
          name: val.name,
          value: date,
        };
      }
      return {
        name: val.name,
        value: val.value,
      };
    });
    const deletePhoto = serverPhoto && serverPhoto.length === 0;

    mutate({
      id,
      data: manipulateValue,
      deletePhoto,
    });
  };
  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={monitoringBargingLoading}>
      <GlobalFormGroup
        field={fieldRhf}
        methods={methods}
        submitForm={handleSubmitForm}
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
            router.push(
              '/input-data/quality-control-management/shipping-monitoring'
            ),
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

export default UpdateShippingMonitoringBook;
