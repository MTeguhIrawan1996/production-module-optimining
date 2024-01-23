import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationShippingMonitoringValues,
  useCreateShippingMonitoring,
} from '@/services/restapi/shipping-monitoring/useCreateShippingMonitoring';
import {
  globalDate,
  globalSelectArriveBargeRhf,
  globalSelectFactoryRhf,
  globalText,
  globalTimeInput,
  heavyEquipmentSelect,
} from '@/utils/constants/Field/global-field';
import { shippingMonitoringMutationValidation } from '@/utils/form-validation/shipping-monitoring/shipping-monitoring-mutation-validation';
import { dateToString } from '@/utils/helper/dateToString';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import { ControllerGroup, ControllerProps } from '@/types/global';

const CreateShippingMonitoringBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();

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
  const { mutate, isLoading } = useCreateShippingMonitoring({
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
        message: t('shippingMonitoring.successCreateMessage'),
        icon: <IconCheck />,
      });
      router.push('/input-data/quality-control-management/shipping-monitoring');
      methods.reset();
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */

  const fieldRhf = React.useMemo(() => {
    const bargeCodeItem = heavyEquipmentSelect({
      colSpan: 6,
      name: 'bargeHeavyEquipmentId',
      label: 'bargeCode',
      withAsterisk: true,
      categoryId: `${process.env.NEXT_PUBLIC_BARGE_ID}`,
    });
    const tugBoatCodeItem = heavyEquipmentSelect({
      colSpan: 6,
      name: 'tugboatHeavyEquipmentId',
      label: 'tugboatCode',
      withAsterisk: false,
      categoryId: `${process.env.NEXT_PUBLIC_TUGBOAT_ID}`,
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
    });
    const vesselOpenTime = globalTimeInput({
      name: 'vesselOpenTime',
      label: 'openVesselHour',
      colSpan: 6,
      withAsterisk: false,
    });
    const vesselCloseDate = globalDate({
      name: 'vesselCloseDate',
      label: 'closeVessel',
      clearable: true,
      withAsterisk: false,
      colSpan: 6,
    });
    const vesselCloseTime = globalTimeInput({
      name: 'vesselCloseTime',
      label: 'closeVesselHour',
      colSpan: 6,
      withAsterisk: false,
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
        methods.trigger('factoryCategoryId');
      },
    });

    const newFactoryCategoryId =
      factoryCategoryId === '' ? null : factoryCategoryId;
    const factoryItem = globalSelectFactoryRhf({
      colSpan: 6,
      name: 'factoryId',
      label: 'factoryName',
      withAsterisk: false,
      disabled: !newFactoryCategoryId,
      categoryId: newFactoryCategoryId,
    });

    const photo: ControllerProps = {
      control: 'image-dropzone',
      name: 'photo',
      label: 'photo',
      description: 'photoDescription',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      multiple: false,
      enableDeletePhoto: true,
      onDrop: (value) => {
        methods.setValue('photo', value);
        methods.clearErrors('photo');
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
  }, [factoryCategoryId]);
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

    mutate({
      data: manipulateValue,
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0}>
      <GlobalFormGroup
        field={fieldRhf}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: isLoading,
        }}
        backButton={{
          onClick: () =>
            router.push(
              '/input-data/quality-control-management/shipping-monitoring'
            ),
        }}
      />
    </DashboardCard>
  );
};

export default CreateShippingMonitoringBook;
