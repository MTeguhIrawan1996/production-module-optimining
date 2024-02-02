import { Flex } from '@mantine/core';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import DashboardCard from '@/components/elements/card/DashboardCard';
import CommonWeeklyPlanInformation from '@/components/elements/ui/CommonWeeklyPlanInformation';

const MutationWorkTimePlanBook = () => {
  // const { t } = useTranslation('default');

  const methods = useForm<any>({
    defaultValues: {
      companyId: '',
      week: null,
      year: null,
    },
    mode: 'onBlur',
  });

  const handleSubmitForm: SubmitHandler<any> = async () => {
    // await executeUpdate({
    //   variables: {
    //     weeklyPlanId: id,
    //     unitCapacityPlans: newUnitCapacityPlan,
    //   },
    // });
  };
  return (
    <DashboardCard p={0}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmitForm)}>
          <Flex gap={32} direction="column" p={22}>
            <CommonWeeklyPlanInformation />
          </Flex>
        </form>
      </FormProvider>
    </DashboardCard>
  );
};

export default MutationWorkTimePlanBook;
