import { UpdateWeeklyPlanGroupPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateWeeklyPlanGroup = () => {
  return <UpdateWeeklyPlanGroupPage />;
};

export default UpdateWeeklyPlanGroup;

UpdateWeeklyPlanGroup.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
