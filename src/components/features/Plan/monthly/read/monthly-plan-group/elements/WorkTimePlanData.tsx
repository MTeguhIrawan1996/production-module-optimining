import * as React from 'react';

import { MutationMonthlyWorkTimePlanBook } from '@/components/elements';
import MonthlyPlanInformationData from '@/components/features/Plan/monthly/read/monthly-plan-group/elements/MonthlyPlanInformationData';

const WorkTimePlanData = () => {
  return (
    <>
      <MonthlyPlanInformationData />
      <MutationMonthlyWorkTimePlanBook mutationType="read" />
    </>
  );
};

export default WorkTimePlanData;
