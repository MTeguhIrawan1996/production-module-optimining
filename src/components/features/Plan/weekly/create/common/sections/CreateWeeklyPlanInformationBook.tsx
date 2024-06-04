import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  ICreateWeeklyPlanInformationValues,
  useCreateWeeklyPlanInformation,
} from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyPlanInformation';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import {
  globalSelectCompanyRhf,
  globalSelectWeekRhf,
  globalSelectYearRhf,
} from '@/utils/constants/Field/global-field';
import { weeklyPlanMutationValidation } from '@/utils/form-validation/plan/weekly/weekly-plan-validation';
import { sendGAEvent } from '@/utils/helper/analytics';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const CreateWeeklyPlanInformationBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
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
  const [executeCreate, { loading }] = useCreateWeeklyPlanInformation({
    onCompleted: ({ createWeeklyPlan }) => {
      sendGAEvent({
        event: 'Tambah',
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
        message: t('weeklyPlan.successCreateMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push(
        `/plan/weekly/create/weekly-plan-group/${createWeeklyPlan.id}?tabs=workTimePlan`
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
    });
    const yearItem = globalSelectYearRhf({});
    const weekItem = globalSelectWeekRhf({
      disabled: !year,
      year: year ? Number(year) : null,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.weeklyPlanInformation'),
        enableGroupLabel: true,
        formControllers: [companyItem, yearItem, weekItem],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<
    ICreateWeeklyPlanInformationValues
  > = async ({ companyId, week, year }) => {
    await executeCreate({
      variables: {
        companyId,
        week: Number(week),
        year: Number(year),
      },
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0}>
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

export default CreateWeeklyPlanInformationBook;
