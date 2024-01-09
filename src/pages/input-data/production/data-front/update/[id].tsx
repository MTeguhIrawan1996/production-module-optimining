import { UpdateFrontProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateFrontProduction = () => {
  return <UpdateFrontProductionPage />;
};

export default UpdateFrontProduction;

UpdateFrontProduction.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
