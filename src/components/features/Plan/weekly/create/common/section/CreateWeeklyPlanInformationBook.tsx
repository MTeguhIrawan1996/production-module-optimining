import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  ICreateWeeklyPlanValues,
  useCreateWeeklyPlan,
} from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyPlan';
import {
  globalSelectCompanyRhf,
  globalSelectWeekRhf,
  globalSelectYearRhf,
} from '@/utils/constants/Field/global-field';
import { weeklyPlanMutationValidation } from '@/utils/form-validation/plan/weekly/weekly-plan-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const CreateWeeklyPlanInformationBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();

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
  const [executeCreate, { loading }] = useCreateWeeklyPlan({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('weeklyPlan.successCreateMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      // router.push('/input-data/production/data-weather');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<ICreateWeeklyPlanValues>(error);
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
    const companyItem = globalSelectCompanyRhf({});
    const yearItem = globalSelectYearRhf({});
    const weekItem = globalSelectWeekRhf({
      disabled: !year,
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
  }, [year]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<ICreateWeeklyPlanValues> = async ({
    companyId,
    week,
    year,
  }) => {
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
