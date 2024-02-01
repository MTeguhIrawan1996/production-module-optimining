import { ReadWeeklyPlanGroupPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadWeeklyPlanGroup = () => {
  return <ReadWeeklyPlanGroupPage />;
};

export default ReadWeeklyPlanGroup;

ReadWeeklyPlanGroup.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
