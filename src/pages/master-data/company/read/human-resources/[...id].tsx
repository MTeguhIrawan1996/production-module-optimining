import { ReadCompanyHumanResourcesPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadCompanyHumanResources = () => {
  return <ReadCompanyHumanResourcesPage />;
};

export default ReadCompanyHumanResources;

ReadCompanyHumanResources.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
