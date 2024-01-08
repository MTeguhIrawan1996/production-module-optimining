import { CreateFrontProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateFrontProduction = () => {
  return <CreateFrontProductionPage />;
};

export default CreateFrontProduction;

CreateFrontProduction.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
