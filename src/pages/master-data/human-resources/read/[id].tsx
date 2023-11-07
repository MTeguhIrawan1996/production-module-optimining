import { ReadHumanResourcesPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadHumanResources = () => {
  return <ReadHumanResourcesPage />;
};

export default ReadHumanResources;

ReadHumanResources.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
