import { ReadMonthlyPlanInformationPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadMonthlyPlanInformation = () => {
  return <ReadMonthlyPlanInformationPage />;
};

export default ReadMonthlyPlanInformation;

ReadMonthlyPlanInformation.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
