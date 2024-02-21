import { UpdateMonthlyPlanInformationPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateMonthlyPlanInformation = () => {
  return <UpdateMonthlyPlanInformationPage />;
};

export default UpdateMonthlyPlanInformation;

UpdateMonthlyPlanInformation.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
