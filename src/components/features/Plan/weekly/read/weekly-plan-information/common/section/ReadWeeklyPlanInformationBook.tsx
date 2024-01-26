import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { ICreateWeeklyPlanValues } from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyPlan';
import { useReadOneWeeklyPlan } from '@/services/graphql/query/plan/weekly/useReadOneWeeklyPlan';
import {
  globalSelectCompanyRhf,
  globalSelectWeekRhf,
  globalSelectYearRhf,
} from '@/utils/constants/Field/global-field';
import { weeklyPlanMutationValidation } from '@/utils/form-validation/plan/weekly/weekly-plan-validation';

import { ControllerGroup } from '@/types/global';

const ReadWeeklyPlanInformationBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

  /* #   /**=========== Methods =========== */
  const methods = useForm<ICreateWeeklyPlanValues<string>>({
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
  // const [executeCreate, { loading }] = useCreateWeeklyPlan({
  //   onCompleted: () => {
  //     notifications.show({
  //       color: 'green',
  //       title: 'Selamat',
  //       message: t('weeklyPlan.successCreateMessage'),
  //       icon: <IconCheck />,
  //     });
  //     methods.reset();
  //     // router.push('/input-data/production/data-weather');
  //   },
  //   onError: (error) => {
  //     if (error.graphQLErrors) {
  //       const errorArry = errorBadRequestField<ICreateWeeklyPlanValues>(error);
  //       if (errorArry.length) {
  //         errorArry.forEach(({ name, type, message }) => {
  //           methods.setError(name, { type, message });
  //         });
  //         return;
  //       }
  //       notifications.show({
  //         color: 'red',
  //         title: 'Gagal',
  //         message: error.message,
  //         icon: <IconX />,
  //       });
  //     }
  //   },
  // });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */
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
        actionOuterGroup: {
          updateButton: {
            label: 'Edit',
          },
        },
        formControllers: [companyItem, yearItem, weekItem],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, weeklyPlanData]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<ICreateWeeklyPlanValues> = async () => {
    // await executeCreate({
    //   variables: {
    //     companyId,
    //     week: Number(week),
    //     year: Number(year),
    //   },
    // });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={weeklyPlanDataLoading}>
      <GlobalFormGroup
        field={fieldRhf}
        methods={methods}
        submitForm={handleSubmitForm}
        nextButton={{}}
        backButton={{
          onClick: () => router.push('/plan/weekly'),
        }}
      />
    </DashboardCard>
  );
};

export default ReadWeeklyPlanInformationBook;
