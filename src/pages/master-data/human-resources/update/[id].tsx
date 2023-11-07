import { UpdateHumanResourcesPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateHumanResources = () => {
  return <UpdateHumanResourcesPage />;
};

export default UpdateHumanResources;

UpdateHumanResources.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
