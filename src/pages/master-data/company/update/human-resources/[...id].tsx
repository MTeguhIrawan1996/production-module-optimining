import { UpdateCompanyHumanResourcesPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateCompanyHumanResource = () => {
  return <UpdateCompanyHumanResourcesPage />;
};

export default UpdateCompanyHumanResource;

UpdateCompanyHumanResource.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
