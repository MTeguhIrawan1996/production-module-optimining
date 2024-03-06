import { UpdateMonthlyPlanPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateMonthlyPlan = () => {
  return <UpdateMonthlyPlanPage />;
};

export default UpdateMonthlyPlan;

UpdateMonthlyPlan.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
