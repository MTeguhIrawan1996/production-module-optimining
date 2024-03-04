import { ReadMonthlyPlanGroupPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadMonthlyPlanGroup = () => {
  return <ReadMonthlyPlanGroupPage />;
};

export default ReadMonthlyPlanGroup;

ReadMonthlyPlanGroup.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
