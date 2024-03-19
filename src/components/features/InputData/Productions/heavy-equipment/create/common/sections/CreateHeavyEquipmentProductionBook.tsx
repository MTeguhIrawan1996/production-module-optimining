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
  globalNumberInput,
  globalText,
  globalTimeInput,
  heavyEquipmentSelect,
} from '@/utils/constants/Field/global-field';
import { shiftSelect } from '@/utils/constants/Field/sample-house-field';
import { heavyEquipmentProductionMutationValidation } from '@/utils/form-validation/heavy-equipment-production/heavy-equipment-production-validation';
import { secondsDuration } from '@/utils/helper/dateFormat';
import { dateToString } from '@/utils/helper/dateToString';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import { hourDiff, timeToSecond } from '@/utils/helper/hourDiff';

import { ControllerGroup } from '@/types/global';

const CreateHeavyEquipmentProductionBook = () => {
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
  const [newHourMeterBefore, setNewHourMeterBefore] = useDebouncedState<number>(
    0,
    400
  );
  const [newHourMeterAfter, setNewHourMeterAfter] = useDebouncedState<number>(
    0,
    400
  );

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
      hourMeterBefore: 0,
      hourMeterAfter: 0,
      amountHourMeter: '',
      fuel: '',
      loseTimes: [],
      isHeavyEquipmentProblematic: false,
      companyHeavyEquipmentChangeId: '',
      changeTime: '',
    },
    mode: 'onBlur',
  });

  const companyHeavyEquipmentId = methods.watch('companyHeavyEquipmentId');
  const loseTimeWatch = methods.watch('loseTimes');
  const isHeavyEquipmentProblematic = methods.watch(
    'isHeavyEquipmentProblematic'
  );

  const {
    fields: loseTimeFields,
    replace: loseTimeReplaces,
    update: loseTimeUpdate,
  } = useFieldArray({
    name: 'loseTimes',
    control: methods.control,
  });

  React.useEffect(() => {
    const amountWorkTime = hourDiff({
      startTime: newWorkStartTime,
      endTime: newWorkFinishTime,
      functionIsBeforeEndTime: true,
    });
    methods.setValue('amountWorkTime', amountWorkTime ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newWorkStartTime, newWorkFinishTime]);
  const amountHourMeter = React.useMemo(() => {
    const amountHourMeterValue = newHourMeterAfter - newHourMeterBefore;
    return amountHourMeterValue;
  }, [newHourMeterAfter, newHourMeterBefore]);
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  useReadAllWHPsMaster({
    variables: {
      limit: null,
    },
    fetchPolicy: 'cache-and-network',
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
      name: 'date',
      label: 'date',
      withAsterisk: true,
      clearable: true,
      colSpan: 6,
    });
    const formanItem = employeeSelect({
      colSpan: 6,
      name: 'foremanId',
      label: 'foreman',
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
      name: 'companyHeavyEquipmentId',
      label: 'heavyEquipmentCode',
      withAsterisk: true,
      onChange: (value) => {
        methods.setValue('companyHeavyEquipmentId', value ?? '');
        methods.setValue('heavyEquipmentType', '');
        methods.trigger('companyHeavyEquipmentId');
      },
    });
    const companyHeavyEquipmentChangeItem = heavyEquipmentSelect({
      colSpan: 6,
      name: 'companyHeavyEquipmentChangeId',
      label: 'heavyEquipmentCodeSubstitution',
      withAsterisk: true,
    });
    const changeTimeItem = globalTimeInput({
      name: 'changeTime',
      label: 'changeTime',
      withAsterisk: true,
      colSpan: 6,
    });
    const shiftItem = shiftSelect({
      colSpan: 6,
      name: 'shiftId',
    });
    const workStartTimeItem = globalTimeInput({
      name: 'workStartTime',
      label: 'workingHourStart',
      withAsterisk: true,
      colSpan: 12,
      onChange: (e) => {
        methods.setValue('workStartTime', e.currentTarget.value);
        setNewWorkStartTime(e.currentTarget.value);
        methods.trigger('workStartTime');
      },
    });
    const workFinishTimeItem = globalTimeInput({
      name: 'workFinishTime',
      label: 'workingHourFinish',
      withAsterisk: true,
      colSpan: 12,
      onChange: (e) => {
        methods.setValue('workFinishTime', e.currentTarget.value);
        setNewWorkFinishTime(e.currentTarget.value);
        methods.trigger('workFinishTime');
      },
    });
    const amountWorkTimeItem = globalText({
      colSpan: 12,
      name: 'amountWorkTime',
      label: 'workingHourAmount',
      withAsterisk: false,
      disabled: true,
    });
    const desc = globalText({
      colSpan: 12,
      name: 'desc',
      label: 'desc',
      withAsterisk: false,
    });
    const heavyEquipmentTypeItem = globalText({
      colSpan: 6,
      name: 'heavyEquipmentType',
      label: 'typeHeavyEquipment',
      withAsterisk: false,
      disabled: true,
    });
    const hourMeterBeforeItem = globalNumberInput({
      colSpan: 12,
      name: 'hourMeterBefore',
      label: 'hourMeterBefore',
      withAsterisk: true,
      onChange: (value) => {
        methods.setValue('hourMeterBefore', value || 0);
        setNewHourMeterBefore(value || 0);
        methods.trigger('hourMeterBefore');
      },
    });
    const hourMeterAfterItem = globalNumberInput({
      colSpan: 12,
      name: 'hourMeterAfter',
      label: 'hourMeterAfter',
      withAsterisk: true,
      onChange: (value) => {
        methods.setValue('hourMeterAfter', value || 0);
        setNewHourMeterAfter(value || 0);
        methods.trigger('hourMeterAfter');
      },
    });
    const amountHourMeterItem = globalNumberInput({
      colSpan: 12,
      name: 'amountHourMeter',
      label: 'amountHourMeter',
      withAsterisk: false,
      disabled: true,
      value: amountHourMeter,
    });
    const fuelItem = globalNumberInput({
      colSpan: 6,
      name: 'fuel',
      label: 'amountFuel',
      withAsterisk: false,
      formatter: (value) =>
        !Number.isNaN(parseFloat(value)) ? `${value} Ltr` : '',
      precision: 0,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.heavyEquipmentInformation'),
        enableGroupLabel: true,
        formControllers: [
          formanItem,
          date,
          heavyEquipmantCodeItem,
          companyHeavyEquipmentChangeItem,
          heavyEquipmentTypeItem,
          changeTimeItem,
          shiftItem,
          operatorItem,
          fuelItem,
        ],
      },
      {
        group: t('commonTypography.workingHour'),
        enableGroupLabel: true,
        formControllers: [
          workStartTimeItem,
          workFinishTimeItem,
          amountWorkTimeItem,
        ],
      },
      {
        group: t('commonTypography.hourMeter'),
        enableGroupLabel: true,
        formControllers: [
          hourMeterBeforeItem,
          hourMeterAfterItem,
          amountHourMeterItem,
        ],
      },
      ...sampleGroupItem,
      {
        group: t('commonTypography.desc'),
        enableGroupLabel: false,
        formControllers: [desc],
      },
    ];

    isHeavyEquipmentProblematic
      ? field
      : field[0].formControllers.splice(3, 1) &&
        field[0].formControllers.splice(4, 1);

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleGroupItem, amountHourMeter, isHeavyEquipmentProblematic]);
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
        switchProps={{
          label: 'problemHeavyEquipment',
          switchItem: {
            checked: isHeavyEquipmentProblematic,
            onChange: (value) =>
              methods.setValue(
                'isHeavyEquipmentProblematic',
                value.currentTarget.checked
              ),
          },
        }}
        backButton={{
          onClick: () =>
            router.push('/input-data/production/data-heavy-equipment'),
        }}
      />
    </DashboardCard>
  );
};

export default CreateHeavyEquipmentProductionBook;
