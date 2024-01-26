import { CreateWeeklyPlanPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateWeeklyPlan = () => {
  return <CreateWeeklyPlanPage />;
};

export default CreateWeeklyPlan;

CreateWeeklyPlan.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
