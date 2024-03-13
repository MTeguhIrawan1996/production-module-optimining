import { UpdateMapYearlyProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateMapYearlyProduction = () => {
  return <UpdateMapYearlyProductionPage />;
};

export default UpdateMapYearlyProduction;

UpdateMapYearlyProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
