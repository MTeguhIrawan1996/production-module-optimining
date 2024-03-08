import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, Grid } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import CommonWeeklyPlanInformation from '@/components/elements/book/weekly-plan/ui/CommonWeeklyPlanInformation';
import InputTableProductionPlan from '@/components/elements/book/weekly-plan/ui/InputTableProductionTargetPlan';
import DashboardCard from '@/components/elements/card/DashboardCard';
import GlobalFormGroup from '@/components/elements/form/GlobalFormGroup';

import {
  IWeeklyProductionTarget,
  IWeeklyProductionTargetPlanData,
  IWeeklyProductionTargetPlanValues,
  useCreateWeeklyProductionTargetPlan,
} from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyProductionTargetPlan';
import { useReadAllMaterialsMaster } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { useReadOneProductionTargetPlan } from '@/services/graphql/query/plan/weekly/production-target-plan/useReadOneProductionTargetPlan';
import { productionTarget } from '@/utils/constants/DefaultValues/production-target-plan';
import { weeklyProductionTargetPlanMutationValidation } from '@/utils/form-validation/plan/weekly/weekly-production-target-plan-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

interface IMutationProductionTargetPlanBook {
  mutationType?: 'create' | 'update' | 'read';
  mutationSuccessMassage?: string;
}

const MutationProductionTargetPlanBook = ({
  mutationType,
  mutationSuccessMassage,
}: IMutationProductionTargetPlanBook) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [tabs, setTabs] = useQueryState('tabs');
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);
  const [skipMaterialQuery, setSkipMaterialQuery] =
    React.useState<boolean>(false);

  const methods = useForm<IWeeklyProductionTargetPlanValues>({
    resolver: zodResolver(weeklyProductionTargetPlanMutationValidation),
    defaultValues: {
      productionTargetPlans: [
        {
          id: null,
          materialId: 'sr',
          materialName: 'SR',
          isPerent: true,
          index: null,
          weeklyProductionTargets: productionTarget,
        },
      ],
    },
    mode: 'onBlur',
  });

  const { fields: productionTargetPlanFields } = useFieldArray({
    name: 'productionTargetPlans',
    control: methods.control,
    keyName: 'productionTargetPlanId',
  });

  const [executeUpdate, { loading }] = useCreateWeeklyProductionTargetPlan({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: mutationSuccessMassage,
        icon: <IconCheck />,
      });
      setTabs('miningMapPlan');
      if (mutationType === 'update') {
        setIsOpenConfirmation(false);
      }
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<IWeeklyProductionTargetPlanValues>(error);
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

  useReadAllMaterialsMaster({
    variables: {
      limit: null,
      orderDir: 'asc',
      orderBy: 'createdAt',
      parentId: null,
      isHaveParent: false,
      includeIds: null,
    },
    skip: skipMaterialQuery || tabs !== 'productionTargetPlan',
    onCompleted: ({ materials }) => {
      const oreMaterial = materials.data.find(
        (v) => v.id === `${process.env.NEXT_PUBLIC_MATERIAL_ORE_ID}`
      );
      const materialValueLength = materials.data?.length || 0;

      const newPerentMaterial: IWeeklyProductionTargetPlanData[] =
        materials.data.map((Obj, i) => {
          return {
            id: null,
            materialId: Obj.id,
            materialName: Obj.name,
            isPerent: true,
            index: i,
            weeklyProductionTargets: productionTarget,
          };
        });

      const newSubMaterialOre: IWeeklyProductionTargetPlanData[] | undefined =
        oreMaterial?.subMaterials.map((sObj, i) => {
          return {
            id: null,
            materialId: sObj.id,
            materialName: sObj.name,
            isPerent: false,
            index: materialValueLength + i,
            weeklyProductionTargets: productionTarget,
          };
        });

      methods.setValue('productionTargetPlans', [
        ...newPerentMaterial,
        ...(newSubMaterialOre ?? []),
        ...productionTargetPlanFields,
      ]);
      setSkipMaterialQuery(true);
    },
  });

  const { weeklyProductionTargetPlanDataLoading } =
    useReadOneProductionTargetPlan({
      variables: {
        weeklyPlanId: id,
      },
      skip: !skipMaterialQuery || tabs !== 'productionTargetPlan',
      onCompleted: ({ weeklyProductionTargetPlans }) => {
        if (
          weeklyProductionTargetPlans.data &&
          weeklyProductionTargetPlans.data.length > 0
        ) {
          weeklyProductionTargetPlans.data.forEach((val) => {
            const newWeeklyProductionTarget: IWeeklyProductionTarget[] =
              val.weeklyProductionTargets.map((wObj) => {
                return {
                  id: wObj.id || null,
                  day: wObj.day,
                  rate: wObj.rate || '',
                  ton: wObj.ton || '',
                };
              });
            const productionTargetPlanIndex =
              productionTargetPlanFields.findIndex(
                (item) => item.materialId === val.material.id
              );
            methods.setValue(
              `productionTargetPlans.${productionTargetPlanIndex}.id`,
              val.id
            );
            methods.setValue(
              `productionTargetPlans.${productionTargetPlanIndex}.weeklyProductionTargets`,
              newWeeklyProductionTarget
            );
          });
        }
        if (mutationType === 'read') {
          const newSR: IWeeklyProductionTarget[] =
            weeklyProductionTargetPlans.additional.strippingRatio.map(
              (sObj) => {
                return {
                  id: null,
                  day: sObj.day,
                  rate: 0,
                  ton: sObj.ton || '',
                };
              }
            );
          methods.setValue(
            `productionTargetPlans.${
              productionTargetPlanFields.length - 1
            }.weeklyProductionTargets`,
            newSR
          );
        }
      },
    });

  const fieldRhf = React.useMemo(() => {
    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.productionTargetPlan'),
        enableGroupLabel: false,
        formControllers: [],
        paperProps: {
          withBorder: false,
          p: 0,
        },
        renderItem: () => {
          return (
            <Grid.Col span={12}>
              <InputTableProductionPlan
                mutationType={mutationType}
                isLoading={weeklyProductionTargetPlanDataLoading}
              />
            </Grid.Col>
          );
        },
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, mutationType, weeklyProductionTargetPlanDataLoading]);

  const handleSubmitForm: SubmitHandler<
    IWeeklyProductionTargetPlanValues
  > = async (data) => {
    const newProductionTargetPlans: Omit<
      IWeeklyProductionTargetPlanData,
      'materialName' | 'isPerent'
    >[] = data.productionTargetPlans
      .filter((f) => f.materialId !== 'sr')
      .map(({ id, materialId, weeklyProductionTargets }) => {
        const newWeeklyProductionTargets: IWeeklyProductionTarget[] =
          weeklyProductionTargets.map((wObj) => {
            return {
              id: wObj.id || undefined,
              day: wObj.day,
              rate: wObj.rate || null,
              ton: wObj.ton || null,
            };
          });
        return {
          id: id || undefined,
          materialId: materialId,
          weeklyProductionTargets: newWeeklyProductionTargets,
        };
      });
    await executeUpdate({
      variables: {
        weeklyPlanId: id,
        productionTargetPlans: newProductionTargetPlans,
      },
    });
  };

  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };

  return (
    <DashboardCard p={0}>
      <Flex gap={32} direction="column" p={mutationType === 'read' ? 0 : 22}>
        {mutationType === 'read' ? undefined : <CommonWeeklyPlanInformation />}
        <GlobalFormGroup
          flexProps={{
            p: 0,
          }}
          field={fieldRhf}
          methods={methods}
          submitForm={handleSubmitForm}
          submitButton={
            mutationType === 'read'
              ? undefined
              : {
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
                }
          }
          backButton={
            mutationType === 'read'
              ? undefined
              : {
                  onClick: () =>
                    router.push(
                      mutationType === 'update'
                        ? `/plan/weekly/${mutationType}/${id}`
                        : `/plan/weekly`
                    ),
                }
          }
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

export default MutationProductionTargetPlanBook;
