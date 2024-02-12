import { Flex, Grid } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import DashboardCard from '@/components/elements/card/DashboardCard';
import GlobalFormGroup from '@/components/elements/form/GlobalFormGroup';
import InputTableBargingTargetPlan from '@/components/elements/input/InputTableBargingTargetPlan';
import CommonWeeklyPlanInformation from '@/components/elements/ui/CommonWeeklyPlanInformation';
import InputGroupDome, {
  IInputGroupDomeProps,
} from '@/components/elements/ui/InputGroupDome';

import {
  IBargingTargetPlan,
  IBargingTargetPlanValue,
  IWeeklyBargingTarget,
  useCreateWeeklyBargingTargetPlan,
} from '@/services/graphql/mutation/plan/weekly/useCreateBargingTargetPlan';
import { useReadAllMaterialsMaster } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { bargingTarget } from '@/utils/constants/DefaultValues/barging-target-plan';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

interface IMutationBargingTargetPlanBook {
  mutationType?: 'create' | 'update';
  mutationSuccessMassage?: string;
}

const MutationBargingTargetPlanBook = ({
  mutationType,
  mutationSuccessMassage,
}: IMutationBargingTargetPlanBook) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const tabs = router.query.tabs as string;
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);

  const methods = useForm<IBargingTargetPlanValue>({
    // resolver: zodResolver(weeklyUnitCapacityPlanMutationValidation),
    defaultValues: {
      bargingTargetPlans: [
        {
          id: null,
          materialId: null,
          materialName: '',
          weeklyBargingTargets: bargingTarget,
        },
      ],
      bargingDomePlans: [
        {
          id: null,
          domeId: null,
        },
      ],
    },
    mode: 'onBlur',
  });

  const {
    fields: bargingDomePlanFields,
    append: bargingDomePlanAppend,
    remove: bargingDomePlanRemove,
  } = useFieldArray({
    name: 'bargingDomePlans',
    control: methods.control,
    keyName: 'bargingDomePlanId',
  });

  useReadAllMaterialsMaster({
    variables: {
      limit: null,
      orderDir: 'desc',
      isHaveParent: false,
      parentId: null,
      includeIds: null,
    },
    skip: tabs !== 'bargingTargetPlan',
    onCompleted: ({ materials }) => {
      const newBargingtargetPlan: IBargingTargetPlan[] = materials.data.map(
        (Obj) => {
          return {
            id: null,
            materialId: Obj.id,
            materialName: Obj.name,
            weeklyBargingTargets: bargingTarget,
          };
        }
      );
      methods.setValue('bargingTargetPlans', newBargingtargetPlan);
    },
  });

  const [executeUpdate, { loading }] = useCreateWeeklyBargingTargetPlan({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: mutationSuccessMassage,
        icon: <IconCheck />,
      });
      router.push(
        `/plan/weekly/${mutationType}/weekly-plan-group/${id}?tabs=${tabs}`
      );
      if (mutationType === 'update') {
        setIsOpenConfirmation(false);
      }
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<IBargingTargetPlanValue>(error);
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

  const fieldRhf = React.useMemo(() => {
    const domeGroup: IInputGroupDomeProps[] = bargingDomePlanFields.map(
      (obj, i) => ({
        bargingDomePlanIndex: i,
        uniqKey: obj.bargingDomePlanId,
        tabs: tabs,
        addButtonOuter:
          i === 0
            ? {
                onClick: () => {
                  bargingDomePlanAppend({
                    id: null,
                    domeId: '',
                  });
                },
              }
            : undefined,
        deleteButtonInner: {
          onClick: () => {
            bargingDomePlanFields.length > 1 ? bargingDomePlanRemove(i) : null;
          },
        },
      })
    );

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.bargingTargetPlan'),
        enableGroupLabel: true,
        formControllers: [],
        renderItem: () => {
          return (
            <>
              <Grid.Col span={12}>
                <InputTableBargingTargetPlan />
              </Grid.Col>
              {domeGroup.map(
                ({ bargingDomePlanIndex, uniqKey, ...restDome }) => (
                  <Grid.Col
                    span={12}
                    key={`${bargingDomePlanIndex}.${uniqKey}`}
                  >
                    <InputGroupDome
                      bargingDomePlanIndex={bargingDomePlanIndex}
                      {...restDome}
                    />
                  </Grid.Col>
                )
              )}
            </>
          );
        },
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bargingDomePlanFields, tabs]);

  const handleSubmitForm: SubmitHandler<IBargingTargetPlanValue> = async (
    data
  ) => {
    const newBargingTargetPlans: IBargingTargetPlan[] = data.bargingTargetPlans
      .map(({ id, materialId, weeklyBargingTargets }) => {
        const newWeeklyBargingTargets: IWeeklyBargingTarget[] =
          weeklyBargingTargets
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
          materialId,
          weeklyBargingTargets: newWeeklyBargingTargets,
        };
      })
      .filter((v) => v.weeklyBargingTargets.length > 0);
    const newBargingDomePlans = data.bargingDomePlans.filter((v) => v.domeId);

    await executeUpdate({
      variables: {
        weeklyPlanId: id,
        bargingTargetPlans: newBargingTargetPlans,
        bargingDomePlans: newBargingDomePlans,
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

export default MutationBargingTargetPlanBook;
