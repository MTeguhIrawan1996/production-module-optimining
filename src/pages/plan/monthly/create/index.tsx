import { CreateMonthlyPlanInformationPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateMonthlyPlan = () => {
  return <CreateMonthlyPlanInformationPage />;
};

export default CreateMonthlyPlan;

CreateMonthlyPlan.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
