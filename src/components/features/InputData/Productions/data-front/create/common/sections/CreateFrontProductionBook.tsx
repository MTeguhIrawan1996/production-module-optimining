import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationFrontProductionValues,
  useCreateFrontProduction,
} from '@/services/graphql/mutation/front-production/useCreateFrontProduction';
import { useReadOneBlockPitMaster } from '@/services/graphql/query/block/useReadOneBlockPitMaster';
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
import { dateToString } from '@/utils/helper/dateToString';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const CreateFrontProductionBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const pageParams = useSearchParams();
  const segment = pageParams.get('segment') || 'pit';

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

  React.useEffect(() => {
    methods.setValue('type', segment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment]);

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
  const [executeCreate, { loading }] = useCreateFrontProduction({
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
    });
    const locationItem = locationSelect({
      colSpan: 6,
      name: 'frontId',
      label: 'front',
      withAsterisk: true,
      categoryId: `${process.env.NEXT_PUBLIC_FRONT_ID}`,
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
    });
    const domeItem = domeNameSelect({
      colSpan: 12,
      name: 'domeId',
      label: 'dome',
      withAsterisk: true,
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
    });
    const elevasiItem = locationSelect({
      colSpan: 6,
      name: 'elevationId',
      label: 'elevation',
      withAsterisk: false,
      categoryId: `${process.env.NEXT_PUBLIC_ELEVASI_ID}`,
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
  }, [segment]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<
    IMutationFrontProductionValues
  > = async (data) => {
    const date = dateToString(data.date ?? null);

    await executeCreate({
      variables: {
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
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0}>
      <GlobalFormGroup
        field={fieldRhf}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        backButton={{
          onClick: () =>
            router.push(
              `/input-data/production/data-front?page=1&segment=${segment}`
            ),
        }}
      />
    </DashboardCard>
  );
};

export default CreateFrontProductionBook;
