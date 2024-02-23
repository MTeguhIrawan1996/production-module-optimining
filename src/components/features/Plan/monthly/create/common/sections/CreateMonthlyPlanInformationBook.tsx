import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  ICreateMonthlyPlanInformationValues,
  useCreateMonthlyPlanInformation,
} from '@/services/graphql/mutation/plan/monthly/useCreateMonthlyPlanInformation';
import {
  globalSelectCompanyRhf,
  globalSelectMonthRhf,
  globalSelectYearRhf,
} from '@/utils/constants/Field/global-field';
import { monthlyPlanInformationMutationValidation } from '@/utils/form-validation/plan/monthly/monthly-plan-information-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const CreateMonthlyPlanInformationBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();

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
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const [executeCreate, { loading }] = useCreateMonthlyPlanInformation({
    onCompleted: ({ createMonthlyPlan }) => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('monthlyPlan.successCreateMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push(
        `/plan/monthly/create/monthly-plan-group/${createMonthlyPlan.id}?tabs=workTimePlan&year=${createMonthlyPlan.year}&month=${createMonthlyPlan.month}`
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
    });
    const yearItem = globalSelectYearRhf({});
    const monthItm = globalSelectMonthRhf({});

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.monthlyPlanInformation'),
        enableGroupLabel: true,
        formControllers: [companyItem, yearItem, monthItm],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<
    ICreateMonthlyPlanInformationValues
  > = async ({ companyId, month, year }) => {
    await executeCreate({
      variables: {
        companyId,
        month: Number(month),
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
          onClick: () => router.push('/plan/monthly'),
        }}
      />
    </DashboardCard>
  );
};

export default CreateMonthlyPlanInformationBook;
