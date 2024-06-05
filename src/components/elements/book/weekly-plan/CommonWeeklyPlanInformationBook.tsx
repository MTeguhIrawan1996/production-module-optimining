import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { ICreateWeeklyPlanInformationValues } from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyPlanInformation';
import { useUpdateWeeklyPlanInformation } from '@/services/graphql/mutation/plan/weekly/useUpdateWeeklyPlanInformation';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadOneWeeklyPlan } from '@/services/graphql/query/plan/weekly/useReadOneWeeklyPlan';
import {
  globalSelectCompanyRhf,
  globalSelectWeekRhf,
  globalSelectYearRhf,
} from '@/utils/constants/Field/global-field';
import { weeklyPlanMutationValidation } from '@/utils/form-validation/plan/weekly/weekly-plan-validation';
import { sendGAEvent } from '@/utils/helper/analytics';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

import { ControllerGroup } from '@/types/global';

interface ICommonWeeklyPlanInformationBook {
  type: 'read' | 'update';
}

const CommonWeeklyPlanInformationBook: React.FC<
  ICommonWeeklyPlanInformationBook
> = ({ type }) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const isPermissionUpdate = permissions?.includes('update-weekly-plan');
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });

  /* #   /**=========== Methods =========== */
  const methods = useForm<ICreateWeeklyPlanInformationValues<string>>({
    resolver: zodResolver(weeklyPlanMutationValidation),
    defaultValues: {
      companyId: '',
      week: null,
      year: null,
    },
    mode: 'onBlur',
  });
  const year = methods.watch('year');
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
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
  const [executeUpdate, { loading }] = useUpdateWeeklyPlanInformation({
    onCompleted: () => {
      sendGAEvent({
        event: 'Edit',
        params: {
          category: 'Rencana',
          subSubCategory: '',
          subCategory: 'Rencana - Mingguan',
          account: userAuthData?.email ?? '',
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('weeklyPlan.successUpdateMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push(
        `/plan/weekly/create/weekly-plan-group/${id}?tabs=workTimePlan`
      );
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<ICreateWeeklyPlanInformationValues>(error);
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
  const fieldRhf = React.useMemo(() => {
    const companyItem = globalSelectCompanyRhf({
      label: 'companyName',
      disabled: type === 'read' ? true : false,
      defaultValue: weeklyPlanData?.company?.id ?? '',
      labelValue: weeklyPlanData?.company?.name ?? '',
    });
    const yearItem = globalSelectYearRhf({
      disabled: type === 'read' ? true : false,
    });
    const weekItem = globalSelectWeekRhf({
      disabled: type === 'read' ? true : !year,
      year: year ? Number(year) : null,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.weeklyPlanInformation'),
        enableGroupLabel: true,
        actionOuterGroup: {
          updateButton:
            isPermissionUpdate && type === 'read'
              ? {
                  label: 'Edit',
                  onClick: () =>
                    router.push(
                      `/plan/weekly/update/weekly-plan-information/${id}`
                    ),
                }
              : undefined,
        },
        formControllers: [companyItem, yearItem, weekItem],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, weeklyPlanData, type, isPermissionUpdate]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<
    ICreateWeeklyPlanInformationValues
  > = async ({ companyId, week, year }) => {
    await executeUpdate({
      variables: {
        id,
        companyId,
        week: Number(week),
        year: Number(year),
      },
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={weeklyPlanDataLoading}>
      <GlobalFormGroup
        field={fieldRhf}
        methods={methods}
        submitForm={handleSubmitForm}
        nextButton={
          type === 'read'
            ? {
                onClick: () =>
                  router.push(
                    `/plan/weekly/${type}/weekly-plan-group/${id}?tabs=workTimePlan`
                  ),
              }
            : undefined
        }
        submitButton={
          type === 'update'
            ? {
                label: t('commonTypography.save'),
                loading: loading,
              }
            : undefined
        }
        backButton={{
          onClick: () => router.push(`/plan/weekly/${type}/${id}`),
        }}
      />
    </DashboardCard>
  );
};

export default CommonWeeklyPlanInformationBook;
