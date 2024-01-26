import { ReadWeeklyPlanInformationPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadWeeklyPlanInformation = () => {
  return <ReadWeeklyPlanInformationPage />;
};

export default ReadWeeklyPlanInformation;

ReadWeeklyPlanInformation.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
