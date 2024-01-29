import { UpdateWeeklyPlanPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateWeeklyPlan = () => {
  return <UpdateWeeklyPlanPage />;
};

export default UpdateWeeklyPlan;

UpdateWeeklyPlan.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
