/* eslint-disable unused-imports/no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import {
  FieldArrayWithId,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationHeavyEquipmentDataProdValues,
  useCreateHeavyEquipmentProduction,
} from '@/services/graphql/mutation/heavy-equipment-production/useCreateHeavyEquipmentProduction';
import { useReadOneHeavyEquipmentCompany } from '@/services/graphql/query/heavy-equipment/useReadOneHeavyEquipmentCompany';
import { useReadAllWHPsMaster } from '@/services/graphql/query/working-hours-plan/useReadAllWHPMaster';
import {
  employeeSelect,
  globalDate,
  globalText,
  globalTimeInput,
  heavyEquipmentSelect,
} from '@/utils/constants/Field/global-field';
import { heavyEquipmentProductionMutationValidation } from '@/utils/form-validation/heavy-equipment-production/heavy-equipment-production-validation';
import { secondsDuration } from '@/utils/helper/dateFormat';
import { dateToString } from '@/utils/helper/dateToString';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import { hourDiff, timeToSecond } from '@/utils/helper/hourDiff';

import { ControllerGroup } from '@/types/global';

const CreateMapProductionBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const [newWorkStartTime, setNewWorkStartTime] = useDebouncedState<string>(
    '',
    400
  );
  const [newWorkFinishTime, setNewWorkFinishTime] = useDebouncedState<string>(
    '',
    400
  );
  const [newHourMeterBefore, setNewHourMeterBefore] = useDebouncedState<
    number | ''
  >('', 400);
  const [newHourMeterAfter, setNewHourMeterAfter] = useDebouncedState<
    number | ''
  >('', 400);

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationHeavyEquipmentDataProdValues>({
    resolver: zodResolver(heavyEquipmentProductionMutationValidation),
    defaultValues: {
      date: undefined,
      foremanId: '',
      operatorId: '',
      companyHeavyEquipmentId: '',
      shiftId: '',
      workStartTime: '',
      workFinishTime: '',
      amountWorkTime: '',
      desc: '',
      heavyEquipmentType: '',
      hourMeterBefore: '',
      hourMeterAfter: '',
      amountHourMeter: '',
      fuel: '',
      loseTimes: [],
    },
    mode: 'onBlur',
  });

  const companyHeavyEquipmentId = methods.watch('companyHeavyEquipmentId');
  const loseTimeWatch = methods.watch('loseTimes');

  const {
    fields: loseTimeFields,
    replace: loseTimeReplaces,
    update: loseTimeUpdate,
  } = useFieldArray({
    name: 'loseTimes',
    control: methods.control,
  });

  React.useEffect(() => {
    const amountWorkTime = hourDiff(newWorkStartTime, newWorkFinishTime);
    methods.setValue('amountWorkTime', amountWorkTime ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newWorkStartTime, newWorkFinishTime]);
  const amountHourMeter = React.useMemo(() => {
    if (newHourMeterAfter && newHourMeterBefore) {
      const amountHourMeterValue = newHourMeterAfter - newHourMeterBefore;
      return amountHourMeterValue;
    }
    return '';
  }, [newHourMeterAfter, newHourMeterBefore]);
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  useReadAllWHPsMaster({
    variables: {
      limit: null,
    },
    onCompleted: (data) => {
      const otherloseTime = data.workingHourPlans.data.map((val) => {
        return {
          workingHourPlanId: val.id,
          name: val.activityName,
          amountHour: '',
          details: [],
        };
      });
      loseTimeReplaces(otherloseTime);
    },
  });

  useReadOneHeavyEquipmentCompany({
    variables: {
      id: companyHeavyEquipmentId as string,
    },
    skip: companyHeavyEquipmentId === '' || !companyHeavyEquipmentId,
    onCompleted: ({ companyHeavyEquipment }) => {
      methods.setValue(
        'heavyEquipmentType',
        companyHeavyEquipment.heavyEquipment?.reference?.type?.name ?? ''
      );
    },
  });

  const [executeCreate, { loading }] = useCreateHeavyEquipmentProduction({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('heavyEquipmentProd.successCreateMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push('/input-data/production/data-heavy-equipment');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<IMutationHeavyEquipmentDataProdValues>(error);
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
  const loseTimeGroup = React.useCallback(
    (
      val: FieldArrayWithId<
        IMutationHeavyEquipmentDataProdValues,
        'loseTimes',
        'id'
      >,
      index: number
    ) => {
      const label = val.name?.replace(/\b(?:Jam|jam|hour|Hour)\b/g, '');
      const totalSeconds = loseTimeWatch?.[index].details?.reduce(
        (acc, curr) => {
          const durationInSeconds =
            timeToSecond(curr.startTime, curr.finishTime) || 0;
          const currentValue = acc + durationInSeconds;

          return currentValue;
        },
        0
      );

      const returnItem = val.details?.map((_, i: number) => {
        const startTimeItem = globalTimeInput({
          name: `loseTimes.${index}.details.${i}.startTime`,
          label: `${t('commonTypography.startHour')} ${label ?? ''}`,
          labelWithTranslate: false,
          withAsterisk: true,
          key: `loseTimes.${val.id}.details.${i}.startTime`,
          colSpan: 6,
        });
        const finishTimeItem = globalTimeInput({
          name: `loseTimes.${index}.details.${i}.finishTime`,
          label: `${t('commonTypography.endHour')} ${label ?? ''}`,
          labelWithTranslate: false,
          withAsterisk: true,
          key: `loseTimes.${val.id}.details.${i}.finishTime`,
          colSpan: 6,
        });
        return { startTimeItem, finishTimeItem };
      });

      const itemController = returnItem?.flatMap(
        ({ startTimeItem, finishTimeItem }) => [startTimeItem, finishTimeItem]
      );
      const amountHourItem = globalText({
        colSpan: 12,
        name: `loseTimes.${index}.amountHour`,
        label: `${t('commonTypography.hourAmount')} ${label ?? ''}`,
        withAsterisk: false,
        disabled: true,
        labelWithTranslate: false,
        key: `loseTimes.${val.id}.amountHour`,
        value: `${
          !totalSeconds || totalSeconds === 0
            ? ''
            : secondsDuration(totalSeconds ?? null)
        }`,
      });

      const group: ControllerGroup = {
        group: val.name ?? '',
        enableGroupLabel: true,
        actionGroup: {
          addButton: {
            label: `${t('commonTypography.create')} ${val.name}`,
            onClick: () => {
              loseTimeUpdate(index, {
                workingHourPlanId: val.workingHourPlanId,
                name: val.name,
                amountHour: val.amountHour,
                details: [
                  ...(val.details ?? []),
                  {
                    startTime: '',
                    finishTime: '',
                  },
                ],
              });
            },
          },
          deleteButton: {
            label: t('commonTypography.delete'),
            onClick: () => {
              const copyArray = val.details?.slice();
              copyArray?.pop();
              loseTimeUpdate(index, {
                workingHourPlanId: val.workingHourPlanId,
                name: val.name,
                amountHour: val.amountHour,
                details: copyArray ?? [],
              });
            },
          },
        },
        formControllers: [...(itemController ?? []), amountHourItem],
      };
      return group;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loseTimeWatch]
  );

  const sampleGroupItem = loseTimeFields.map(loseTimeGroup);

  const fieldRhf = React.useMemo(() => {
    const date = globalDate({
      name: 'mapType',
      label: 'mapType',
      withAsterisk: true,
      clearable: true,
      colSpan: 6,
    });
    const formanItem = employeeSelect({
      colSpan: 6,
      name: 'mapName',
      label: 'mapName',
      withAsterisk: true,
    });
    const operatorItem = employeeSelect({
      colSpan: 6,
      name: 'operatorId',
      label: 'operator',
      withAsterisk: true,
    });
    const heavyEquipmantCodeItem = heavyEquipmentSelect({
      colSpan: 6,
      name: 'location',
      label: 'location',
      withAsterisk: true,
    });

    const heavyEquipmentTypeItem = globalText({
      colSpan: 6,
      name: 'year',
      label: 'year',
      withAsterisk: false,
      disabled: true,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.mapInformation'),
        enableGroupLabel: true,
        formControllers: [
          formanItem,
          date,
          heavyEquipmantCodeItem,
          heavyEquipmentTypeItem,
        ],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleGroupItem, amountHourMeter]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<
    IMutationHeavyEquipmentDataProdValues
  > = async (data) => {
    const {
      heavyEquipmentType,
      amountWorkTime,
      amountHourMeter,
      loseTimes,
      date,
      fuel,
      ...restValue
    } = data;
    const newLoseTimes = loseTimes.map(({ workingHourPlanId, details }) => ({
      workingHourPlanId,
      details,
    }));

    await executeCreate({
      variables: {
        loseTimes: newLoseTimes,
        date: dateToString(date ?? null),
        fuel: fuel || null,
        ...restValue,
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
          onClick: () => router.push('/input-data/production/mzp/create'),
        }}
      />
    </DashboardCard>
  );
};

export default CreateMapProductionBook;
