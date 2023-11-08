import { CreateCompanyHumanResourcesPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateCompanyHumanResource = () => {
  return <CreateCompanyHumanResourcesPage />;
};

export default CreateCompanyHumanResource;

CreateCompanyHumanResource.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
