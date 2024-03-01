import { UpdateMapProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateMapProduction = () => {
  return <UpdateMapProductionPage />;
};

export default UpdateMapProduction;

UpdateMapProduction.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
