import * as React from 'react';

import { MutationWorkTimePlanBook } from '@/components/elements';
import WeeklyPlanInformationData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/WeeklyPlanInformationData';

const WorkTimePlanData = () => {
  return (
    <>
      <WeeklyPlanInformationData />
      <MutationWorkTimePlanBook mutationType="read" />
    </>
  );
};

export default WorkTimePlanData;
