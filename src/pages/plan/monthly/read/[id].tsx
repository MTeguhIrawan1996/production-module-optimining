import { ReadMonthlyPlanPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadMonthlyPlan = () => {
  return <ReadMonthlyPlanPage />;
};

export default ReadMonthlyPlan;

ReadMonthlyPlan.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
