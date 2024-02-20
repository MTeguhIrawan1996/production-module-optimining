import { MonthlyPlanPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const MonthlyPlan = () => {
  return <MonthlyPlanPage />;
};

export default MonthlyPlan;

MonthlyPlan.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
