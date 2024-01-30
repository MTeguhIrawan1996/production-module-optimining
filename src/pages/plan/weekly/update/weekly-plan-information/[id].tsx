import { UpdateWeeklyPlanInformationPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateWeeklyPlanInformation = () => {
  return <UpdateWeeklyPlanInformationPage />;
};

export default UpdateWeeklyPlanInformation;

UpdateWeeklyPlanInformation.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
