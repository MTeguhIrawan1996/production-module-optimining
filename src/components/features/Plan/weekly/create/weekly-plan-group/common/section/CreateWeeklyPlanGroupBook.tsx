import { zodResolver } from '@hookform/resolvers/zod';
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
import { IInputGroupMaterialProps } from '@/components/elements/ui/InputGroupMaterial';

import {
  IUnitCapacityPlanValues,
  useCreateWeeklyUnitCapacityPlan,
} from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyUnitcapacityPlan';
import { useReadOneWeeklyPlan } from '@/services/graphql/query/plan/weekly/useReadOneWeeklyPlan';
import { material } from '@/utils/constants/DefaultValues/unit-capacity-plans';
import {
  globalInputAvarageArray,
  globalInputSumArray,
  globalMultipleSelectLocation,
  globalSelectCompanyRhf,
  globalSelectWeekRhf,
  globalSelectYearRhf,
  globalText,
} from '@/utils/constants/Field/global-field';
import { weeklyUnitCapacityPlanMutationValidation } from '@/utils/form-validation/plan/weekly/weekly-unit-capacity-plan-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const CreateWeeklyPlanGroupBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

  const methods = useForm<IUnitCapacityPlanValues>({
    resolver: zodResolver(weeklyUnitCapacityPlanMutationValidation),
    defaultValues: {
      companyId: '',
      week: null,
      year: null,
      unitCapacityPlans: [
        {
          locationIds: [],
          activityName: '',
          materials: [material],
        },
      ],
    },
    mode: 'onBlur',
  });
  const year = methods.watch('year');
  const {
    fields: unitCapacityFields,
    append: unitCapacityAppend,
    update: unitCapacityUpdate,
    remove: unitCapacityRemove,
  } = useFieldArray({
    name: 'unitCapacityPlans',
    control: methods.control,
    keyName: 'unitCapacityPlanId',
  });

  const { weeklyPlanData, weeklyPlanDataLoading } = useReadOneWeeklyPlan({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: (data) => {
      methods.setValue('companyId', data.weeklyPlan.company?.id ?? '');
      methods.setValue('week', `${data.weeklyPlan.week}`);
      methods.setValue('year', `${data.weeklyPlan.year}`);
    },
  });

  const [executeUpdate, { loading }] = useCreateWeeklyUnitCapacityPlan({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('weeklyPlan.successCreateUnitCapacityPlanMessage'),
        icon: <IconCheck />,
      });
      // methods.reset();
      // router.push('/input-data/production/data-weather');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<IUnitCapacityPlanValues>(error);
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

  const unitCpacityCallback = React.useCallback(
    (
      obj: FieldArrayWithId<
        IUnitCapacityPlanValues,
        'unitCapacityPlans',
        'unitCapacityPlanId'
      >,
      index: number
    ) => {
      const activityNameItem = globalText({
        name: `unitCapacityPlans.${index}.activityName`,
        label: 'activityName',
        key: `${obj.unitCapacityPlanId}.activityName`,
      });
      const multipleSelectLocationItem = globalMultipleSelectLocation({
        label: 'location',
        name: `unitCapacityPlans.${index}.locationIds`,
        key: `${obj.unitCapacityPlanId}.locationIds`,
      });
      const amountFleetItem = globalInputSumArray({
        label: 'amountFleet',
        name: `unitCapacityPlans.${index}.materials`,
        withAsterisk: false,
        key: `${obj.unitCapacityPlanId}.amountFleet`,
        disabled: true,
        keyObj: 'fleet',
      });
      const avarageDistanceItem = globalInputAvarageArray({
        label: 'avarageDistance',
        name: `unitCapacityPlans.${index}.materials`,
        withAsterisk: false,
        key: `${obj.unitCapacityPlanId}.avarageDistance`,
        disabled: true,
        keyObj: 'distance',
      });
      const dumpTruckTotalItem = globalInputSumArray({
        label: 'dumpTruckTotal',
        withAsterisk: false,
        name: `unitCapacityPlans.${index}.materials`,
        key: `${obj.unitCapacityPlanId}.dumpTruckTotal`,
        disabled: true,
        keyObj: 'dumpTruckCount',
        precision: 0,
      });

      const materialGroup: IInputGroupMaterialProps[] = obj.materials.map(
        (_, i) => ({
          unitCapacityPlanIndex: index,
          materialIndex: i,
          uniqKey: obj.unitCapacityPlanId,
          addButtonOuter:
            i === 0
              ? {
                  onClick: () => {
                    const value = methods.getValues(
                      `unitCapacityPlans.${index}`
                    );
                    unitCapacityUpdate(index, {
                      id: value.id || '',
                      activityName: value.activityName,
                      locationIds: value.locationIds,
                      materials: [...value.materials, material],
                    });
                  },
                }
              : undefined,
          deleteButtonInner: {
            onClick: () => {
              const value = methods.getValues(`unitCapacityPlans.${index}`);
              const copyArray = value.materials?.slice();
              copyArray.splice(i, 1);
              unitCapacityFields?.[index].materials?.length > 1
                ? unitCapacityUpdate(index, {
                    id: value.id || '',
                    activityName: value.activityName,
                    locationIds: value.locationIds,
                    materials: copyArray ?? [],
                  })
                : null;
            },
          },
        })
      );

      const group: ControllerGroup = {
        group: t('commonTypography.unitCapacityPlanInformation'),
        enableGroupLabel: true,
        formControllers: [
          multipleSelectLocationItem,
          activityNameItem,
          amountFleetItem,
          avarageDistanceItem,
          dumpTruckTotalItem,
        ],
        inputGroupMaterial: materialGroup,
        actionOuterGroup: {
          addButton:
            index === 0
              ? {
                  label: t('commonTypography.createLocation'),
                  onClick: () =>
                    unitCapacityAppend({
                      locationIds: [],
                      activityName: '',
                      materials: [material],
                    }),
                }
              : undefined,
        },
        actionGroup: {
          deleteButton: {
            label: t('commonTypography.delete'),
            onClick: () =>
              unitCapacityFields.length > 1 ? unitCapacityRemove(index) : null,
          },
        },
      };

      return group;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unitCapacityFields]
  );

  const unitCapacityPlanGroup = unitCapacityFields.map(unitCpacityCallback);

  const fieldRhf = React.useMemo(() => {
    const companyItem = globalSelectCompanyRhf({
      disabled: true,
      defaultValue: weeklyPlanData?.company?.id ?? '',
      labelValue: weeklyPlanData?.company?.name ?? '',
    });
    const yearItem = globalSelectYearRhf({
      disabled: true,
    });
    const weekItem = globalSelectWeekRhf({
      disabled: true,
      year: year ? Number(year) : null,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.companyInformation'),
        enableGroupLabel: true,
        formControllers: [companyItem, yearItem, weekItem],
      },
      ...unitCapacityPlanGroup,
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, weeklyPlanData, unitCapacityPlanGroup]);

  const handleSubmitForm: SubmitHandler<IUnitCapacityPlanValues> = async (
    data
  ) => {
    const newUnitCapacityPlan = data.unitCapacityPlans.map(
      ({ activityName, locationIds, materials }) => {
        const materialValues = materials.map(
          ({ targetPlans, ...restMaterial }) => {
            const targetPlansFilter = targetPlans.filter(
              (val) => val.rate && val.ton
            );
            const materialObj = {
              targetPlans: targetPlansFilter,
              ...restMaterial,
            };
            return materialObj;
          }
        );
        const newUnitCapacityPlanObj = {
          activityName: activityName,
          locationIds: locationIds,
          materials: materialValues,
        };
        return newUnitCapacityPlanObj;
      }
    );
    await executeUpdate({
      variables: {
        weeklyPlanId: id,
        unitCapacityPlans: newUnitCapacityPlan,
      },
    });
  };
  return (
    <DashboardCard p={0} isLoading={weeklyPlanDataLoading}>
      <GlobalFormGroup
        field={fieldRhf}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        backButton={{
          onClick: () => router.push('/plan/weekly'),
        }}
      />
    </DashboardCard>
  );
};

export default CreateWeeklyPlanGroupBook;
