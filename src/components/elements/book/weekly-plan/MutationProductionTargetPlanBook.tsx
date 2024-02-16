import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, Grid } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import InputTableProductionPlan from '@/components/elements/book/weekly-plan/ui/InputTableProductionTargetPlan';
import DashboardCard from '@/components/elements/card/DashboardCard';
import GlobalFormGroup from '@/components/elements/form/GlobalFormGroup';
import CommonWeeklyPlanInformation from '@/components/elements/ui/CommonWeeklyPlanInformation';

import {
  IWeeklyProductionTarget,
  IWeeklyProductionTargetPlanData,
  IWeeklyProductionTargetPlanValues,
  useCreateWeeklyProductionTargetPlan,
} from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyProductionTargetPlan';
import { useReadAllMaterialsMaster } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { productionTarget } from '@/utils/constants/DefaultValues/production-target-plan';
import { weeklyProductionTargetPlanMutationValidation } from '@/utils/form-validation/plan/weekly/weekly-production-target-plan-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

interface IMutationBargingTargetPlanBook {
  mutationType?: 'create' | 'update';
  mutationSuccessMassage?: string;
}

const MutationProductionTargetPlan = ({
  mutationType,
  mutationSuccessMassage,
}: IMutationBargingTargetPlanBook) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const tabs = router.query.tabs as string;
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
          weeklyProductionTargets: productionTarget,
        },
      ],
    },
    mode: 'onBlur',
  });

  const {
    fields: productionTargetPlanFields,
    // replace: productionTargetPlanReplace,
    // prepend: productionTargetPlanPrepend,
  } = useFieldArray({
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
      // router.push(`/plan/weekly`);
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

  const { materialsDataLoading } = useReadAllMaterialsMaster({
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
      const newPerentMaterial: IWeeklyProductionTargetPlanData[] =
        materials.data.map((Obj) => {
          return {
            id: null,
            materialId: Obj.id,
            materialName: Obj.name,
            isPerent: true,
            weeklyProductionTargets: productionTarget,
          };
        });

      const newSubMaterialOre: IWeeklyProductionTargetPlanData[] | undefined =
        oreMaterial?.subMaterials.map((sObj) => {
          return {
            id: null,
            materialId: sObj.id,
            materialName: sObj.name,
            isPerent: false,
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
              <InputTableProductionPlan />
            </Grid.Col>
          );
        },
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs]);

  const handleSubmitForm: SubmitHandler<
    IWeeklyProductionTargetPlanValues
  > = async (data) => {
    const newProductionTargetPlans: Omit<
      IWeeklyProductionTargetPlanData,
      'materialName' | 'isPerent'
    >[] = data.productionTargetPlans
      .filter(
        (f) =>
          f.materialId !== 'sr' &&
          f.materialId !== `${process.env.NEXT_PUBLIC_MATERIAL_ORE_ID}`
      )
      .map(({ id, materialId, weeklyProductionTargets }) => {
        const newWeeklyProductionTargets: IWeeklyProductionTarget[] =
          weeklyProductionTargets
            .filter((v) => v.rate && v.ton)
            .map((wObj) => {
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
    <DashboardCard p={0} isLoading={materialsDataLoading}>
      <Flex gap={32} direction="column" p={22}>
        <CommonWeeklyPlanInformation />
        <GlobalFormGroup
          flexProps={{
            p: 0,
          }}
          field={fieldRhf}
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

export default MutationProductionTargetPlan;
