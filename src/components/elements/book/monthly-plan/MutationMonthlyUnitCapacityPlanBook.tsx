import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, Grid } from '@mantine/core';
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
import { shallow } from 'zustand/shallow';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';
import MonthlyInputGroupMaterial, {
  IMonthlyInputGroupMaterialProps,
} from '@/components/elements/book/monthly-plan/input/MonthlyInputGroupMaterial';
import CommonMonthlyPlanInformation from '@/components/elements/book/monthly-plan/ui/CommonMonthlyPlanInformation';

import {
  IMonthlyTargetPlan,
  IMonthlyUnitCapacityPlanValues,
} from '@/services/graphql/mutation/plan/monthly/useCreateMonthlyUnitcapacityPlan';
import { useCreateWeeklyUnitCapacityPlan } from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyUnitcapacityPlan';
import { useReadOneMonthlyPlan } from '@/services/graphql/query/plan/monthly/useReadOneMonthlyPlan';
import { useReadOneUnitCapacityPlan } from '@/services/graphql/query/plan/weekly/useReadOneUnitCapacityPlan';
import {
  globalInputaverageArray,
  globalInputSumArray,
  globalMultipleSelectLocation,
  globalText,
} from '@/utils/constants/Field/global-field';
import { weeklyUnitCapacityPlanMutationValidation } from '@/utils/form-validation/plan/weekly/weekly-unit-capacity-plan-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import { getWeeksInMonth } from '@/utils/helper/getWeeksInMonth';
import { useStoreWeeklyInMonthly } from '@/utils/store/useWeekInMonthlyStore';

import { ControllerGroup } from '@/types/global';

interface IMutationMonthlyUnitCapacityPlanBook {
  mutationType?: 'create' | 'update';
  mutationSuccessMassage?: string;
}

const MutationMonthlyUnitCapacityPlanBook: React.FC<
  IMutationMonthlyUnitCapacityPlanBook
> = ({ mutationType, mutationSuccessMassage }) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const tabs = router.query.tabs as string;
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);
  const [weeklyInMonthly, setWeeklyInMonthly] = useStoreWeeklyInMonthly(
    (state) => [state.weeklyInMonthly, state.setWeeklyInMonthly],
    shallow
  );

  const methods = useForm<IMonthlyUnitCapacityPlanValues>({
    resolver: zodResolver(weeklyUnitCapacityPlanMutationValidation),
    defaultValues: {
      unitCapacityPlans: [
        {
          id: '',
          locationIds: [],
          activityName: '',
          materials: [
            {
              id: '',
              materialId: '',
              fleet: '',
              classId: '',
              frontId: '',
              physicalAvailability: '',
              useOfAvailability: '',
              effectiveWorkingHour: '',
              distance: '',
              dumpTruckCount: '',
              targetPlans: [],
            },
          ],
        },
      ],
    },
    mode: 'onBlur',
  });

  const {
    fields: unitCapacityFields,
    append: unitCapacityAppend,
    update: unitCapacityUpdate,
    remove: unitCapacityRemove,
    // replace: unitCapacityReplace,
  } = useFieldArray({
    name: 'unitCapacityPlans',
    control: methods.control,
    keyName: 'unitCapacityPlanId',
  });

  useReadOneMonthlyPlan({
    variables: {
      id,
    },
    skip: !router.isReady || tabs !== 'unitCapacityPlan',
    onCompleted: (data) => {
      const weekInMonth = getWeeksInMonth(
        `${data.monthlyPlan.year}`,
        `${data.monthlyPlan.month}`
      );
      const newWeekInMonth: IMonthlyTargetPlan[] = weekInMonth.map((val) => ({
        id: null,
        week: val,
        rate: '',
        ton: '',
      }));
      methods.setValue(
        'unitCapacityPlans.0.materials.0.targetPlans',
        newWeekInMonth
      );
      setWeeklyInMonthly(weekInMonth);
    },
  });

  useReadOneUnitCapacityPlan({
    variables: {
      weeklyPlanId: id,
      limit: null,
    },
    skip: !router.isReady || tabs !== 'unitCapacityPlan',
    onCompleted: () => {
      // if (data.weeklyUnitCapacityPlans.data.length > 0) {
      //   const unitCapacityPlans = data.weeklyUnitCapacityPlans.data.map(
      //     (obj) => {
      //       const locationIds = obj.locations.map((val) => val.id);
      //       const materials = obj.materials.map((val) => {
      //         const targetPlans = val.targetPlans.map((tObj) => {
      //           const targetPlanValue: ITargetPlan = {
      //             id: tObj.id || '',
      //             day: tObj.day,
      //             rate: tObj.rate || '',
      //             ton: tObj.ton || '',
      //           };
      //           return targetPlanValue;
      //         });
      //         const materialValue: IMaterialsGroup = {
      //           id: val.id || '',
      //           materialId: val.material.id,
      //           fleet: `${val.fleet}`,
      //           classId: val.class.id,
      //           frontId: val.front.id,
      //           physicalAvailability: val.physicalAvailability,
      //           useOfAvailability: val.useOfAvailability,
      //           effectiveWorkingHour: val.effectiveWorkingHour,
      //           distance: val.distance,
      //           dumpTruckCount: val.dumpTruckCount,
      //           targetPlans: targetPlans,
      //         };
      //         return materialValue;
      //       });
      //       const returnValue: IUnitCapacityPlanProps = {
      //         id: obj.id || '',
      //         locationIds,
      //         activityName: obj.activityName,
      //         materials: materials,
      //       };
      //       return returnValue;
      //     }
      //   );
      //   unitCapacityReplace(unitCapacityPlans);
      // }
    },
  });

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [executeUpdate, { loading }] = useCreateWeeklyUnitCapacityPlan({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: mutationSuccessMassage,
        icon: <IconCheck />,
      });
      router.push(
        `/plan/weekly/${mutationType}/weekly-plan-group/${id}?tabs=heavyEquipmentReqPlan`
      );
      if (mutationType === 'update') {
        setIsOpenConfirmation(false);
      }
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<IMonthlyUnitCapacityPlanValues>(error);
        if (mutationType === 'update') {
          setIsOpenConfirmation(false);
        }
        if (errorArry.length) {
          errorArry.forEach(({ name, type, message }) => {
            methods.setError(name, { type, message }, { shouldFocus: true });
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

  const unitCapacityCallback = React.useCallback(
    (
      obj: FieldArrayWithId<
        IMonthlyUnitCapacityPlanValues,
        'unitCapacityPlans',
        'unitCapacityPlanId'
      >,
      index: number
    ) => {
      const newWeekInMonth: IMonthlyTargetPlan[] = weeklyInMonthly.map(
        (val) => ({
          id: null,
          week: val,
          rate: '',
          ton: '',
        })
      );
      const activityNameItem = globalText({
        name: `unitCapacityPlans.${index}.activityName`,
        label: 'activityName',
        key: `${obj.unitCapacityPlanId}.activityName`,
      });
      const multipleSelectLocationItem = globalMultipleSelectLocation({
        label: 'location',
        name: `unitCapacityPlans.${index}.locationIds`,
        key: `${obj.unitCapacityPlanId}.locationIds`,
        skipQuery: tabs !== 'unitCapacityPlan',
        skipSearchQuery: true,
      });
      const amountFleetItem = globalInputSumArray({
        label: 'amountFleet',
        name: `unitCapacityPlans.${index}.materials`,
        withAsterisk: false,
        key: `${obj.unitCapacityPlanId}.amountFleet`,
        disabled: true,
        keyObj: 'fleet',
      });
      const averageDistanceItem = globalInputaverageArray({
        label: 'averageDistance',
        name: `unitCapacityPlans.${index}.materials`,
        withAsterisk: false,
        key: `${obj.unitCapacityPlanId}.averageDistance`,
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

      const materialGroup: IMonthlyInputGroupMaterialProps[] =
        obj.materials.map((_, i) => {
          return {
            unitCapacityPlanIndex: index,
            materialIndex: i,
            uniqKey: obj.unitCapacityPlanId,
            tabs: tabs,
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
                        materials: [
                          ...value.materials,
                          {
                            id: '',
                            materialId: '',
                            fleet: '',
                            classId: '',
                            frontId: '',
                            physicalAvailability: '',
                            useOfAvailability: '',
                            effectiveWorkingHour: '',
                            distance: '',
                            dumpTruckCount: '',
                            targetPlans: newWeekInMonth,
                          },
                        ],
                      });
                    },
                  }
                : undefined,
            deleteButtonInner: {
              onClick: () => {
                const value = methods.getValues(`unitCapacityPlans.${index}`);
                const copyArray = value.materials?.slice();
                copyArray.splice(i, 1);
                unitCapacityFields[index].materials?.length > 1
                  ? unitCapacityUpdate(index, {
                      id: value.id || '',
                      activityName: value.activityName,
                      locationIds: value.locationIds,
                      materials: copyArray ?? [],
                    })
                  : null;
              },
            },
          };
        });

      const group: ControllerGroup = {
        group: t('commonTypography.unitCapacityPlanInformation'),
        enableGroupLabel: true,
        formControllers: [
          multipleSelectLocationItem,
          activityNameItem,
          amountFleetItem,
          averageDistanceItem,
          dumpTruckTotalItem,
        ],
        renderItem: () =>
          materialGroup.map(
            ({
              materialIndex,
              unitCapacityPlanIndex,
              uniqKey,
              ...restMaterial
            }) => (
              <Grid.Col
                span={12}
                key={`${unitCapacityPlanIndex}.${materialIndex}.${uniqKey}`}
              >
                <MonthlyInputGroupMaterial
                  materialIndex={materialIndex}
                  unitCapacityPlanIndex={unitCapacityPlanIndex}
                  {...restMaterial}
                />
              </Grid.Col>
            )
          ),
        actionOuterGroup: {
          addButton:
            index === 0
              ? {
                  label: t('commonTypography.createLocation'),
                  onClick: () =>
                    unitCapacityAppend({
                      id: '',
                      locationIds: [],
                      activityName: '',
                      materials: [
                        {
                          id: '',
                          materialId: '',
                          fleet: '',
                          classId: '',
                          frontId: '',
                          physicalAvailability: '',
                          useOfAvailability: '',
                          effectiveWorkingHour: '',
                          distance: '',
                          dumpTruckCount: '',
                          targetPlans: newWeekInMonth,
                        },
                      ],
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
    [unitCapacityFields, tabs, weeklyInMonthly]
  );

  const unitCapacityPlanGroup = unitCapacityFields.map(unitCapacityCallback);

  const handleSubmitForm: SubmitHandler<
    IMonthlyUnitCapacityPlanValues
  > = async () => {
    // const newUnitCapacityPlan = data.unitCapacityPlans.map(
    //   ({ activityName, locationIds, materials, id }) => {
    //     const materialValues = materials.map(
    //       ({ targetPlans, id: idMaterial, ...restMaterial }) => {
    //         const targetPlansFilter = targetPlans
    //           .filter((val) => val.rate && val.ton)
    //           .map((tObj) => {
    //             const targetPlansValue: ITargetPlan = {
    //               id: tObj.id === '' ? undefined : tObj.id,
    //               day: tObj.day,
    //               rate: tObj.rate,
    //               ton: tObj.ton,
    //             };
    //             return targetPlansValue;
    //           });
    //         const materialObj: IMaterialsGroup = {
    //           id: idMaterial === '' ? undefined : idMaterial,
    //           targetPlans: targetPlansFilter,
    //           ...restMaterial,
    //         };
    //         return materialObj;
    //       }
    //     );
    //     const newUnitCapacityPlanObj: IUnitCapacityPlanProps = {
    //       id: id === '' ? undefined : id,
    //       activityName: activityName,
    //       locationIds: locationIds,
    //       materials: materialValues,
    //     };
    //     return newUnitCapacityPlanObj;
    //   }
    // );
    // await executeUpdate({
    //   variables: {
    //     weeklyPlanId: id,
    //     unitCapacityPlans: newUnitCapacityPlan,
    //   },
    // });
  };

  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };

  return (
    <DashboardCard p={0}>
      <Flex gap={32} direction="column" p={22}>
        <CommonMonthlyPlanInformation />
        <GlobalFormGroup
          flexProps={{
            p: 0,
          }}
          field={unitCapacityPlanGroup}
          methods={methods}
          submitForm={handleSubmitForm}
          submitButton={{
            label: t('commonTypography.save'),
            loading: mutationType === 'create' ? loading : undefined,
            type: mutationType === 'create' ? 'submit' : 'button',
            onClick:
              mutationType === 'update'
                ? async () => {
                    const output = await methods.trigger(undefined, {
                      shouldFocus: true,
                    });
                    if (output) setIsOpenConfirmation((prev) => !prev);
                  }
                : undefined,
          }}
          backButton={{
            onClick: () =>
              router.push(
                mutationType === 'update'
                  ? `/plan/weekly/${mutationType}/${id}`
                  : `/plan/weekly`
              ),
          }}
          modalConfirmation={{
            isOpenModalConfirmation: isOpenConfirmation,
            actionModalConfirmation: () =>
              setIsOpenConfirmation((prev) => !prev),
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
      </Flex>
    </DashboardCard>
  );
};

export default MutationMonthlyUnitCapacityPlanBook;
