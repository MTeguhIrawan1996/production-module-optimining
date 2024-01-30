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
import { useReadOneWeeklyPlan } from '@/services/graphql/query/plan/weekly/useReadOneWeeklyPlan';
import {
  globalSelectCompanyRhf,
  globalSelectWeekRhf,
  globalSelectYearRhf,
} from '@/utils/constants/Field/global-field';
import { weeklyPlanMutationValidation } from '@/utils/form-validation/plan/weekly/weekly-plan-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const UpdateWeeklyPlanGroupBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

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
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('weeklyPlan.successUpdateMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      // router.push('/input-data/production/data-weather');
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
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, weeklyPlanData]);

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

export default UpdateWeeklyPlanGroupBook;
