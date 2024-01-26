import { CreateWeeklyPlanInformationPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateWeeklyPlan = () => {
  return <CreateWeeklyPlanInformationPage />;
};

export default CreateWeeklyPlan;

CreateWeeklyPlan.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
