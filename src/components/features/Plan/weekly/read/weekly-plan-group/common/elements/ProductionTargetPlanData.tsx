import * as React from 'react';

import { MutationProductionTargetPlan } from '@/components/elements';
import WeeklyPlanInformationData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/WeeklyPlanInformationData';

const ProductionTargetPlanData = () => {
  return (
    <>
      <WeeklyPlanInformationData />
      <MutationProductionTargetPlan mutationType="read" />
    </>
  );
};

export default ProductionTargetPlanData;
