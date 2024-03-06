import { CreateWeeklyPlanGroupPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateWeeklyPlanGroup = () => {
  return <CreateWeeklyPlanGroupPage />;
};

export default CreateWeeklyPlanGroup;

CreateWeeklyPlanGroup.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
