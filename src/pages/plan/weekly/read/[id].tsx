import { ReadWeeklyPlanPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadWeeklyPlan = () => {
  return <ReadWeeklyPlanPage />;
};

export default ReadWeeklyPlan;

ReadWeeklyPlan.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
