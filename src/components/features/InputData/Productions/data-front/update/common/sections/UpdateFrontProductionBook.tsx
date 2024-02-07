import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { IMutationFrontProductionValues } from '@/services/graphql/mutation/front-production/useCreateFrontProduction';
import {
  IFrontProductionNameProps,
  IFrontProductionValueProps,
  useUpdateFrontProduction,
} from '@/services/graphql/mutation/front-production/useUpdateFrontProduction';
import { useReadOneBlockPitMaster } from '@/services/graphql/query/block/useReadOneBlockPitMaster';
import { useReadOneFrontProduction } from '@/services/graphql/query/front-production/useReadOneFrontProduction';
import {
  globalDate,
  globalNumberInput,
  globalText,
  heavyEquipmentSelect,
  locationSelect,
  materialSelect,
  pitSelect,
} from '@/utils/constants/Field/global-field';
import { domeNameSelect } from '@/utils/constants/Field/stockpile-field';
import { frontProductionMutationValidation } from '@/utils/form-validation/front-production/front-production-validation';
import { dateToString, stringToDate } from '@/utils/helper/dateToString';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup, IReadOneValueMapping } from '@/types/global';

const UpdateFrontProductionBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const segment = router.query['segment'] || 'pit';
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationFrontProductionValues>({
    resolver: zodResolver(frontProductionMutationValidation),
    defaultValues: {
      date: undefined,
      companyHeavyEquipmentId: '',
      frontId: '',
      materialId: '',
      type: '',
      pitId: '',
      block: '',
      gridId: '',
      elevationId: '',
      domeId: '',
      x: '',
      y: '',
    },
    mode: 'onBlur',
  });
  const pitId = methods.watch('pitId');

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  useReadOneBlockPitMaster({
    variables: {
      id: pitId as string,
    },
    skip: pitId === '' || !pitId,
    onCompleted: ({ pit }) => {
      methods.setValue('block', pit.block.name);
    },
    fetchPolicy: 'cache-first',
  });
  const { frontData, frontDataLoading } = useReadOneFrontProduction({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: ({ frontData }) => {
      const dateFields: IFrontProductionNameProps[] = ['date'];
      const valueMappings: IReadOneValueMapping<
        IFrontProductionNameProps,
        IFrontProductionValueProps
      >[] = [
        {
          key: 'companyHeavyEquipmentId',
          value: frontData.companyHeavyEquipment?.id ?? '',
        },
        {
          key: 'frontId',
          value: frontData.front?.id ?? '',
        },
        { key: 'materialId', value: frontData.material?.id ?? '' },
        { key: 'x', value: frontData.x ?? '' },
        { key: 'y', value: frontData.y ?? '' },
        { key: 'type', value: frontData.type ?? '' },
        {
          key: 'pitId',
          value: frontData.pit?.id ?? '',
        },
        {
          key: 'elevationId',
          value: frontData.elevation?.id ?? '',
        },
        {
          key: 'gridId',
          value: frontData.grid?.id ?? '',
        },
        {
          key: 'domeId',
          value: frontData.dome?.id ?? '',
        },
      ];
      const setValue = (
        key: IFrontProductionNameProps,
        value: IFrontProductionValueProps
      ) => methods.setValue(key, value);
      dateFields.forEach((field) => {
        const date = stringToDate(frontData[field] ?? null);
        setValue(field, date ?? null);
      });
      valueMappings.forEach((mapping) => {
        setValue(mapping.key, mapping.value);
      });
    },
  });
  const [executeUpdate, { loading }] = useUpdateFrontProduction({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('frontProduction.successCreateMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push(
        `/input-data/production/data-front?page=1&segment=${segment}`
      );
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<IMutationFrontProductionValues>(error);
        if (errorArry.length) {
          errorArry.forEach(({ name, type, message }) => {
            methods.setError(name, { type, message });
          });
          return;
        }
        notifications.show({
          color: 'red',
          title: 'Gagal',
          message: error.message,
          icon: <IconX />,
        });
      }
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
    const heavyEquipmentCodeItem = heavyEquipmentSelect({
      colSpan: 12,
      name: 'companyHeavyEquipmentId',
      label: 'heavyEquipmentCode',
      withAsterisk: true,
      categoryId: `${process.env.NEXT_PUBLIC_DUMP_TRUCK_ID}`,
      defaultValue: frontData?.companyHeavyEquipment?.id,
      labelValue: frontData?.companyHeavyEquipment?.hullNumber ?? '',
    });
    const locationItem = locationSelect({
      colSpan: 6,
      name: 'frontId',
      label: 'front',
      withAsterisk: true,
      categoryId: `${process.env.NEXT_PUBLIC_FRONT_ID}`,
      defaultValue: frontData?.front?.id,
      labelValue: frontData?.front?.name ?? '',
    });
    const materialItem = materialSelect({
      colSpan: 6,
      name: 'materialId',
      label: 'material',
      withAsterisk: true,
    });
    const pitItem = pitSelect({
      colSpan: 6,
      name: 'pitId',
      label: 'pit',
      withAsterisk: true,
      onChange: (value) => {
        methods.setValue('pitId', value);
        methods.setValue('block', '');
        methods.trigger('pitId');
      },
      defaultValue: frontData?.pit?.id,
      labelValue: frontData?.pit?.name,
    });
    const domeItem = domeNameSelect({
      colSpan: 12,
      name: 'domeId',
      label: 'dome',
      withAsterisk: true,
      defaultValue: frontData?.dome?.id,
      labelValue: frontData?.dome?.name,
    });
    const block = globalText({
      colSpan: 6,
      name: 'block',
      label: 'block',
      withAsterisk: false,
      disabled: true,
    });
    const gridItem = locationSelect({
      colSpan: 6,
      name: 'gridId',
      label: 'grid',
      withAsterisk: false,
      categoryId: `${process.env.NEXT_PUBLIC_GRID_ID}`,
      defaultValue: frontData?.grid?.id,
      labelValue: frontData?.grid?.name,
    });
    const elevasiItem = locationSelect({
      colSpan: 6,
      name: 'elevationId',
      label: 'elevation',
      withAsterisk: false,
      categoryId: `${process.env.NEXT_PUBLIC_ELEVASI_ID}`,
      defaultValue: frontData?.elevation?.id,
      labelValue: frontData?.elevation?.name,
    });
    const coordinateX = globalNumberInput({
      name: 'x',
      label: 'coordinateX',
      colSpan: 6,
      withAsterisk: false,
      precision: 6,
      step: 0.000001,
    });
    const coordinateY = globalNumberInput({
      name: 'y',
      label: 'coordinateY',
      colSpan: 6,
      withAsterisk: false,
      precision: 6,
      step: 0.000001,
    });

    const fieldIsDome: ControllerGroup[] = [
      {
        group: t('commonTypography.dome'),
        enableGroupLabel: false,
        formControllers: [domeItem],
      },
    ];
    const fieldIsPit: ControllerGroup[] = [
      {
        group: t('commonTypography.location'),
        enableGroupLabel: false,
        formControllers: [pitItem, block, gridItem, elevasiItem],
      },
    ];

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.date'),
        formControllers: [date],
      },
      {
        group: t('commonTypography.heavyEquipmentCode'),
        enableGroupLabel: false,
        formControllers: [heavyEquipmentCodeItem],
      },
      {
        group: t('commonTypography.frontInformation'),
        enableGroupLabel: true,
        formControllers: [locationItem, materialItem],
      },
      ...(segment === 'dome' ? fieldIsDome : fieldIsPit),
      {
        group: t('commonTypography.coordinate'),
        enableGroupLabel: true,
        formControllers: [coordinateX, coordinateY],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment, frontData]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<
    IMutationFrontProductionValues
  > = async (data) => {
    const date = dateToString(data.date ?? null);

    await executeUpdate({
      variables: {
        id,
        date,
        companyHeavyEquipmentId: data.companyHeavyEquipmentId,
        frontId: data.frontId,
        materialId: data.materialId,
        type: data.type,
        x: data.x || null,
        y: data.y || null,
        domeId: data.domeId === '' ? null : data.domeId,
        pitId: data.pitId === '' ? null : data.pitId,
        gridId: data.gridId === '' ? null : data.gridId,
        elevationId: data.elevationId === '' ? null : data.elevationId,
      },
    });
  };
  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={frontDataLoading}>
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
              `/input-data/production/data-front?page=1&segment=${segment}`
            ),
        }}
        modalConfirmation={{
          isOpenModalConfirmation: isOpenConfirmation,
          actionModalConfirmation: () => setIsOpenConfirmation((prev) => !prev),
          actionButton: {
            label: t('commonTypography.yes'),
            type: 'button',
            onClick: handleConfirmation,
            loading: loading,
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

export default UpdateFrontProductionBook;
