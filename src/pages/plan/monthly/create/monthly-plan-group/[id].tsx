import { CreateMonthlyPlanGroupPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateMonthlyPlanGroup = () => {
  return <CreateMonthlyPlanGroupPage />;
};

export default CreateMonthlyPlanGroup;

CreateMonthlyPlanGroup.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
