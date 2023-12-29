/* eslint-disable unused-imports/no-unused-vars */
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
  IMutationCreateHeavyEquipmentDataValues,
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
import { shiftSelect } from '@/utils/constants/Field/sample-house-field';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import { hourDiff } from '@/utils/helper/hourDiff';

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

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationCreateHeavyEquipmentDataValues>({
    // resolver: zodResolver(ritageMovingMutationValidation),
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
      amountEffectiveWorkingHours: '',
      loseTimes: [
        {
          workingHourPlanId: '',
          name: '',
        },
      ],
      details: [
        {
          workingHourPlanId: '',
          startTime: '',
          finishTime: '',
          amountHour: '',
        },
      ],
    },
    mode: 'onBlur',
  });

  const companyHeavyEquipmentId = methods.watch('companyHeavyEquipmentId');

  const { fields: lostTimeFields, replace: lostTimeReplace } = useFieldArray({
    name: 'loseTimes',
    control: methods.control,
  });
  const {
    fields: detailFields,
    replace: detailReplace,
    append,
  } = useFieldArray({
    name: 'details',
    control: methods.control,
  });

  React.useEffect(() => {
    const amountWorkTime = hourDiff(newWorkStartTime, newWorkFinishTime);
    methods.setValue('amountWorkTime', amountWorkTime ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newWorkStartTime, newWorkFinishTime]);

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { workingHourPlansDataLoading } = useReadAllWHPsMaster({
    variables: {
      limit: null,
    },
    onCompleted: (data) => {
      const otherLostTime = data.workingHourPlans.data.map((val) => {
        return {
          workingHourPlanId: val.id,
          name: val.activityName,
        };
      });
      const otherDetails = data.workingHourPlans.data.map((val) => {
        return {
          workingHourPlanId: val.id,
          startTime: '',
          finishTime: '',
          amountHour: '',
        };
      });
      lostTimeReplace(otherLostTime);
      detailReplace(otherDetails);
    },
  });

  useReadOneHeavyEquipmentCompany({
    variables: {
      id: companyHeavyEquipmentId,
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
      router.push('/input-data/production/heavy-equipment');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<IMutationCreateHeavyEquipmentDataValues>(error);
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

  const lostTimeGroup = React.useCallback(
    (
      val: FieldArrayWithId<
        IMutationCreateHeavyEquipmentDataValues,
        'loseTimes',
        'id'
      >,

      index: number
    ) => {
      const label = val.name?.replace(/\b(?:Jam|jam|hour|Hour)\b/g, '');

      detailFields.map(() => {});

      const indexOfId = detailFields.findIndex(
        (o) => o.workingHourPlanId === val.workingHourPlanId
      );

      const startTimeItem = globalTimeInput({
        name: `details.${indexOfId}.startTime`,
        label: `${t('commonTypography.startHour')} ${label ?? ''} ${indexOfId}`,
        labelWithTranslate: false,
        withAsterisk: false,
        colSpan: 6,
      });
      const finishTimeItem = globalTimeInput({
        name: `details.${indexOfId}.finishTime`,
        label: `${t('commonTypography.endHour')} ${label ?? ''} ${indexOfId}`,
        labelWithTranslate: false,
        withAsterisk: false,
        colSpan: 6,
      });

      const group: ControllerGroup = {
        group: val.name ?? '',
        enableGroupLabel: true,
        actionGroup: {
          addButton: {
            label: `${t('commonTypography.create')} ${val.name}`,
            onClick: () => {
              append({
                workingHourPlanId: val.id,
                startTime: '',
                finishTime: '',
                amountHour: '',
              });
            },
          },
          deleteButton: {
            label: t('commonTypography.delete'),
            onClick: () => {},
          },
        },
        formControllers: [startTimeItem, finishTimeItem],
      };
      return group;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [detailFields]
  );

  const sampleGroupItem = lostTimeFields.map(lostTimeGroup);

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
    const amountEffectiveWorkingHoursItem = globalText({
      colSpan: 12,
      name: 'amountEffectiveWorkingHours',
      label: 'amountEffectiveWorkingHours',
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
        group: t('commonTypography.amountEffectiveWorkingHours'),
        enableGroupLabel: false,
        formControllers: [amountEffectiveWorkingHoursItem],
      },
      {
        group: t('commonTypography.desc'),
        enableGroupLabel: false,
        formControllers: [desc],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleGroupItem]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<
    IMutationCreateHeavyEquipmentDataValues
  > = (data) => {
    // executeCreate({
    //   data: manipulateValue,
    // });
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
            router.push('/input-data/production/data-ritage?tabs=moving'),
        }}
      />
    </DashboardCard>
  );
};

export default CreateHeavyEquipmentProductionBook;
