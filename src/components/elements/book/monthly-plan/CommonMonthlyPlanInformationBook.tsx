import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { ICreateMonthlyPlanInformationValues } from '@/services/graphql/mutation/plan/monthly/useCreateMonthlyPlanInformation';
import { useUpdateMonthlyPlanInformation } from '@/services/graphql/mutation/plan/monthly/useUpdateMonthlyPlanInformation';
import { useReadOneMonthlyPlan } from '@/services/graphql/query/plan/monthly/useReadOneMonthlyPlan';
import {
  globalSelectCompanyRhf,
  globalSelectMonthRhf,
  globalSelectYearRhf,
} from '@/utils/constants/Field/global-field';
import { monthlyPlanInformationMutationValidation } from '@/utils/form-validation/plan/monthly/monthly-plan-information-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

interface ICommonMonthlyPlanInformationBook {
  type: 'read' | 'update';
}

const CommonMonthlyPlanInformationBook: React.FC<
  ICommonMonthlyPlanInformationBook
> = ({ type }) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

  /* #   /**=========== Methods =========== */
  const methods = useForm<ICreateMonthlyPlanInformationValues<string>>({
    resolver: zodResolver(monthlyPlanInformationMutationValidation),
    defaultValues: {
      companyId: '',
      month: null,
      year: null,
    },
    mode: 'onBlur',
  });
  const year = methods.watch('year');
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { monthlyPlanData, monthlyPlanDataLoading } = useReadOneMonthlyPlan({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: (data) => {
      methods.setValue('companyId', data.monthlyPlan.company?.id ?? '');
      methods.setValue('month', `${data.monthlyPlan.month}`);
      methods.setValue('year', `${data.monthlyPlan.year}`);
    },
  });
  const [executeUpdate, { loading }] = useUpdateMonthlyPlanInformation({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('monthlyPlan.successUpdateMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push(
        `/plan/monthly/create/monthly-plan-group/${id}?tabs=workTimePlan`
      );
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<ICreateMonthlyPlanInformationValues>(error);
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
      defaultValue: monthlyPlanData?.company?.id ?? '',
      labelValue: monthlyPlanData?.company?.name ?? '',
    });
    const yearItem = globalSelectYearRhf({
      disabled: type === 'read' ? true : false,
    });
    const monthItem = globalSelectMonthRhf({
      disabled: type === 'read' ? true : false,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.monthlyPlanInformation'),
        enableGroupLabel: true,
        actionOuterGroup: {
          updateButton:
            type === 'read'
              ? {
                  label: 'Edit',
                  onClick: () =>
                    router.push(
                      `/plan/monthly/update/monthly-plan-information/${id}`
                    ),
                }
              : undefined,
        },
        formControllers: [companyItem, yearItem, monthItem],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, monthlyPlanData, type]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<
    ICreateMonthlyPlanInformationValues
  > = async ({ companyId, month, year }) => {
    await executeUpdate({
      variables: {
        id,
        companyId,
        month: Number(month),
        year: Number(year),
      },
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={monthlyPlanDataLoading}>
      <GlobalFormGroup
        field={fieldRhf}
        methods={methods}
        submitForm={handleSubmitForm}
        nextButton={
          type === 'read'
            ? {
                onClick: () =>
                  router.push(
                    `/plan/monthly/${type}/monthly-plan-group/${id}?tabs=workTimePlan`
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
          onClick: () => router.push(`/plan/monthly/${type}/${id}`),
        }}
      />
    </DashboardCard>
  );
};

export default CommonMonthlyPlanInformationBook;
