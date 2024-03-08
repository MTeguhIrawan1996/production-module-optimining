import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, Grid } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useQueryState } from 'next-usequerystate';
import * as React from 'react';
import {
  FieldArrayWithId,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';
import InputGroupMaterial, {
  IInputGroupMaterialProps,
} from '@/components/elements/book/weekly-plan/input/InputGroupMaterial';
import CommonWeeklyPlanInformation from '@/components/elements/book/weekly-plan/ui/CommonWeeklyPlanInformation';

import {
  IMaterialsGroup,
  ITargetPlan,
  IUnitCapacityPlanProps,
  IUnitCapacityPlanValues,
  useCreateWeeklyUnitCapacityPlan,
} from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyUnitcapacityPlan';
import { useReadOneUnitCapacityPlan } from '@/services/graphql/query/plan/weekly/useReadOneUnitCapacityPlan';
import { material } from '@/utils/constants/DefaultValues/unit-capacity-plans';
import {
  globalInputaverageArray,
  globalInputSumArray,
  globalMultipleSelectLocation,
  globalText,
} from '@/utils/constants/Field/global-field';
import { weeklyUnitCapacityPlanMutationValidation } from '@/utils/form-validation/plan/weekly/weekly-unit-capacity-plan-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

interface IMutationUnitCapacityPlanBook {
  mutationType?: 'create' | 'update';
  mutationSuccessMassage?: string;
}

const MutationUnitCapacityPlanBook: React.FC<IMutationUnitCapacityPlanBook> = ({
  mutationType,
  mutationSuccessMassage,
}) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [tabs, setTabs] = useQueryState('tabs');
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);

  const methods = useForm<IUnitCapacityPlanValues>({
    resolver: zodResolver(weeklyUnitCapacityPlanMutationValidation),
    defaultValues: {
      unitCapacityPlans: [
        {
          id: null,
          locationIds: [],
          activityName: '',
          materials: [material],
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
    replace: unitCapacityReplace,
  } = useFieldArray({
    name: 'unitCapacityPlans',
    control: methods.control,
    keyName: 'unitCapacityPlanId',
  });

  useReadOneUnitCapacityPlan({
    variables: {
      weeklyPlanId: id,
      limit: null,
    },
    skip: tabs !== 'unitCapacityPlan',
    onCompleted: (data) => {
      if (data.weeklyUnitCapacityPlans.data.length > 0) {
        const unitCapacityPlans = data.weeklyUnitCapacityPlans.data.map(
          (obj) => {
            const locationIds = obj.locations.map((val) => val.id);
            const materials = obj.materials.map((val) => {
              const targetPlans = val.targetPlans.map((tObj) => {
                const targetPlanValue: ITargetPlan = {
                  id: tObj.id || null,
                  day: tObj.day,
                  rate: tObj.rate || '',
                  ton: tObj.ton || '',
                };
                return targetPlanValue;
              });
              const materialValue: IMaterialsGroup = {
                id: val.id || null,
                materialId: val.material.id,
                fleet: `${val.fleet}`,
                classId: val.class.id,
                frontId: val.front.id,
                physicalAvailability: val.physicalAvailability,
                useOfAvailability: val.useOfAvailability,
                effectiveWorkingHour: val.effectiveWorkingHour,
                distance: val.distance,
                dumpTruckCount: val.dumpTruckCount,
                targetPlans: targetPlans,
              };
              return materialValue;
            });
            const returnValue: IUnitCapacityPlanProps = {
              id: obj.id || null,
              locationIds,
              activityName: obj.activityName,
              materials: materials,
            };
            return returnValue;
          }
        );
        unitCapacityReplace(unitCapacityPlans);
      }
    },
  });

  const [executeUpdate, { loading }] = useCreateWeeklyUnitCapacityPlan({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: mutationSuccessMassage,
        icon: <IconCheck />,
      });
      setTabs('heavyEquipmentReqPlan');
      if (mutationType === 'update') {
        setIsOpenConfirmation(false);
      }
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<IUnitCapacityPlanValues>(error);
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

      const materialGroup: IInputGroupMaterialProps[] = obj.materials.map(
        (_, i) => ({
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
                      id: value.id || null,
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
                    id: value.id || null,
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
                <InputGroupMaterial
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
                      id: null,
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
    [unitCapacityFields, tabs]
  );

  const unitCapacityPlanGroup = unitCapacityFields.map(unitCapacityCallback);

  const handleSubmitForm: SubmitHandler<IUnitCapacityPlanValues> = async (
    data
  ) => {
    const newUnitCapacityPlan = data.unitCapacityPlans.map(
      ({ activityName, locationIds, materials, id }) => {
        const materialValues = materials.map(
          ({ targetPlans, id: idMaterial, ...restMaterial }) => {
            const targetPlansFilter = targetPlans
              .filter((val) => val.rate && val.ton)
              .map((tObj) => {
                const targetPlansValue: ITargetPlan = {
                  id: tObj.id ? tObj.id : undefined,
                  day: tObj.day,
                  rate: tObj.rate,
                  ton: tObj.ton,
                };
                return targetPlansValue;
              });

            const materialObj: IMaterialsGroup = {
              id: idMaterial ? idMaterial : undefined,
              targetPlans: targetPlansFilter,
              ...restMaterial,
            };
            return materialObj;
          }
        );

        const newUnitCapacityPlanObj: IUnitCapacityPlanProps = {
          id: id ? id : undefined,
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

  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };

  return (
    <DashboardCard p={0}>
      <Flex gap={32} direction="column" p={22}>
        <CommonWeeklyPlanInformation />
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

export default MutationUnitCapacityPlanBook;
