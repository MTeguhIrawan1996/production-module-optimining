import { CreateMapProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateMapProduction = () => {
  return <CreateMapProductionPage />;
};

export default CreateMapProduction;

CreateMapProduction.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
