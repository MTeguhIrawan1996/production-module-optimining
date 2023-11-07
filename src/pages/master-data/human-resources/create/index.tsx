import { CreateHumanResourcesPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateHumanResources = () => {
  return <CreateHumanResourcesPage />;
};

export default CreateHumanResources;

CreateHumanResources.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
