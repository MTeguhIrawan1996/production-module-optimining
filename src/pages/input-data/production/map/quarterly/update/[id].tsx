import { UpdateMapQuarterlyProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateMapQuarterlyProduction = () => {
  return <UpdateMapQuarterlyProductionPage />;
};

export default UpdateMapQuarterlyProduction;

UpdateMapQuarterlyProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
