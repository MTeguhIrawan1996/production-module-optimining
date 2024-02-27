import { UpdateMonthlyPlanGroupPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateMonthlyPlanGroup = () => {
  return <UpdateMonthlyPlanGroupPage />;
};

export default UpdateMonthlyPlanGroup;

UpdateMonthlyPlanGroup.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
