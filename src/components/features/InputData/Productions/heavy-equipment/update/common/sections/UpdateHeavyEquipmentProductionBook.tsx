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

import { IMutationHeavyEquipmentDataProdValues } from '@/services/graphql/mutation/heavy-equipment-production/useCreateHeavyEquipmentProduction';
import { useUpdateHeavyEquipmentProduction } from '@/services/graphql/mutation/heavy-equipment-production/useUpdateHeavyEquipmentProduction';
import { useReadOneHeavyEquipmentCompany } from '@/services/graphql/query/heavy-equipment/useReadOneHeavyEquipmentCompany';
import { useReadOneHeavyEquipmentProduction } from '@/services/graphql/query/heavy-equipment-production/useReadOneHeavyEquipmentProduction';
import {
  employeeSelect,
  globalDate,
  globalText,
  globalTimeInput,
  heavyEquipmentSelect,
} from '@/utils/constants/Field/global-field';
import { shiftSelect } from '@/utils/constants/Field/sample-house-field';
import { heavyEquipmentProductionMutationValidation } from '@/utils/form-validation/heavy-equipment-production/heavy-equipment-production-validation';
import { formatDate2, secondsDuration } from '@/utils/helper/dateFormat';
import { dateToString, stringToDate } from '@/utils/helper/dateToString';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import { hourDiff, timeToSecond } from '@/utils/helper/hourDiff';

import { ControllerGroup } from '@/types/global';

const UpdateHeavyEquipmentProductionBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [newWorkStartTime, setNewWorkStartTime] = useDebouncedState<string>(
    '',
    400
  );
  const [newWorkFinishTime, setNewWorkFinishTime] = useDebouncedState<string>(
    '',
    400
  );
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);

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
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { heavyEquipmentData, heavyEquipmentDataLoading } =
    useReadOneHeavyEquipmentProduction({
      variables: {
        id,
      },
      skip: !router.isReady,
      onCompleted: ({ heavyEquipmentData }) => {
        const otherLoseTime = heavyEquipmentData.loseTimes?.map((val) => {
          const details = val.details?.map(({ startAt, finishAt }) => {
            const newStartTime = formatDate2(startAt, 'HH:mm:ss');
            const newFinishTime = formatDate2(finishAt, 'HH:mm:ss');
            return {
              startTime: newStartTime ?? '',
              finishTime: newFinishTime ?? '',
            };
          });

          return {
            workingHourPlanId: val.workingHourPlan?.id ?? '',
            name: val.workingHourPlan?.activityName ?? '',
            amountHour: '',
            details: details ?? [],
          };
        });
        if (otherLoseTime) {
          loseTimeReplaces(otherLoseTime);
        }
        const date = stringToDate(heavyEquipmentData.date ?? null);
        const newWorkStartTime = formatDate2(
          heavyEquipmentData.workStartAt,
          'HH:mm:ss'
        );
        const newWorkFinishTime = formatDate2(
          heavyEquipmentData.workFinishAt,
          'HH:mm:ss'
        );
        methods.setValue('date', date);
        methods.setValue('foremanId', heavyEquipmentData.foreman.id);
        methods.setValue('operatorId', heavyEquipmentData.operator.id);
        methods.setValue('shiftId', heavyEquipmentData.shift?.id ?? '');
        methods.setValue(
          'companyHeavyEquipmentId',
          heavyEquipmentData.companyHeavyEquipment?.id ?? ''
        );
        methods.setValue('workStartTime', newWorkStartTime ?? '');
        setNewWorkStartTime(newWorkStartTime ?? '');
        methods.setValue('workFinishTime', newWorkFinishTime ?? '');
        setNewWorkFinishTime(newWorkFinishTime ?? '');
        methods.setValue('desc', heavyEquipmentData.desc ?? '');
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

  const [executeUpdate, { loading }] = useUpdateHeavyEquipmentProduction({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('heavyEquipmentProd.successUpdateMessage'),
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
          colSpan: 6,
          onChange: (e) => {
            methods.setValue(
              `loseTimes.${index}.details.${i}.startTime`,
              e.currentTarget.value
            );
            methods.trigger(`loseTimes.${index}.details.${i}.startTime`);
          },
        });
        const finishTimeItem = globalTimeInput({
          name: `loseTimes.${index}.details.${i}.finishTime`,
          label: `${t('commonTypography.endHour')} ${label ?? ''}`,
          labelWithTranslate: false,
          withAsterisk: true,
          colSpan: 6,
          onChange: (e) => {
            methods.setValue(
              `loseTimes.${index}.details.${i}.finishTime`,
              e.currentTarget.value
            );
            methods.trigger(`loseTimes.${index}.details.${i}.finishTime`);
          },
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
      defaultValue: heavyEquipmentData?.foreman?.id,
      labelValue: heavyEquipmentData?.foreman?.humanResource?.name,
    });
    const operatorItem = employeeSelect({
      colSpan: 6,
      name: 'operatorId',
      label: 'operator',
      withAsterisk: true,
      defaultValue: heavyEquipmentData?.operator?.id,
      labelValue: heavyEquipmentData?.operator?.humanResource?.name,
    });
    const heavyEquipmantCodeItem = heavyEquipmentSelect({
      colSpan: 6,
      name: 'companyHeavyEquipmentId',
      label: 'heavyEquipmentCode',
      withAsterisk: true,
      defaultValue: heavyEquipmentData?.companyHeavyEquipment?.id,
      labelValue: heavyEquipmentData?.companyHeavyEquipment?.hullNumber ?? '',
      onChange: (value) => {
        methods.setValue('companyHeavyEquipmentId', value ?? '');
        methods.setValue('heavyEquipmentType', '');
        methods.trigger('companyHeavyEquipmentId');
      },
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

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.heavyEquipmentInformation'),
        enableGroupLabel: true,
        formControllers: [
          formanItem,
          date,
          heavyEquipmantCodeItem,
          heavyEquipmentTypeItem,
          shiftItem,
          operatorItem,
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
      ...sampleGroupItem,
      {
        group: t('commonTypography.desc'),
        enableGroupLabel: false,
        formControllers: [desc],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleGroupItem, heavyEquipmentData]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<
    IMutationHeavyEquipmentDataProdValues
  > = async (data) => {
    const {
      heavyEquipmentType,
      amountWorkTime,
      loseTimes,
      date,
      ...restValue
    } = data;
    const newLoseTimes = loseTimes
      .map(({ workingHourPlanId, details }) => ({
        workingHourPlanId,
        details,
      }))
      .filter((obj) => obj.details && obj.details.length >= 1);

    await executeUpdate({
      variables: {
        id,
        loseTimes: newLoseTimes,
        date: dateToString(date ?? null),
        ...restValue,
      },
    });
  };
  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={heavyEquipmentDataLoading}>
      <GlobalFormGroup
        field={fieldRhf}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          type: 'button',
          onClick: () => setIsOpenConfirmation((prev) => !prev),
        }}
        backButton={{
          onClick: () =>
            router.push('/input-data/production/data-heavy-equipment'),
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

export default UpdateHeavyEquipmentProductionBook;
