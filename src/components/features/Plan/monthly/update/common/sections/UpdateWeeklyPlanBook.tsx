import { useRouter } from 'next/router';
import * as React from 'react';

import { DashboardCard, PlanGroupLink } from '@/components/elements';

const UpdateMonthlyPlanBook = () => {
  const router = useRouter();

  return (
    <DashboardCard
      p={0}
      enebleBackBottomOuter={{
        onClick: () => router.push('/plan/monthly'),
      }}
    >
      <PlanGroupLink type="update" planType="monthly" />
    </DashboardCard>
  );
};

export default UpdateMonthlyPlanBook;
