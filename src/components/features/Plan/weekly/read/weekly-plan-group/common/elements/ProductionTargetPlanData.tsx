import * as React from 'react';

import { MutationProductionTargetPlanBook } from '@/components/elements';
import WeeklyPlanInformationData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/WeeklyPlanInformationData';

const ProductionTargetPlanData = () => {
  return (
    <>
      <WeeklyPlanInformationData />
      <MutationProductionTargetPlanBook mutationType="read" />
    </>
  );
};

export default ProductionTargetPlanData;
