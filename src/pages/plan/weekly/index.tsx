import { WeeklyPlanPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const WeeklyPlan = () => {
  return <WeeklyPlanPage />;
};

export default WeeklyPlan;

WeeklyPlan.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
