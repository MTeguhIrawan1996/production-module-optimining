import { UpdateMapWeeklyProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateMapWeeklyProduction = () => {
  return <UpdateMapWeeklyProductionPage />;
};

export default UpdateMapWeeklyProduction;

UpdateMapWeeklyProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
