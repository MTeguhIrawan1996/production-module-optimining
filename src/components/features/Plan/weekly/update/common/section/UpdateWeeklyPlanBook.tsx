import { useRouter } from 'next/router';
import * as React from 'react';

import { DashboardCard, PlanGroupLink } from '@/components/elements';

const UpdateWeeklyPlanBook = () => {
  const router = useRouter();

  return (
    <DashboardCard
      p={0}
      enebleBackBottomOuter={{
        onClick: () => router.push('/plan/weekly'),
      }}
    >
      <PlanGroupLink type="update" />
    </DashboardCard>
  );
};

export default UpdateWeeklyPlanBook;
