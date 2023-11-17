import { ReadActivityPlanPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadActivityPlan = () => {
  return <ReadActivityPlanPage />;
};

export default ReadActivityPlan;

ReadActivityPlan.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
