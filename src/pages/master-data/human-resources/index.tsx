import { HumanResourcesPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const HumanResources = () => {
  return <HumanResourcesPage />;
};

export default HumanResources;

HumanResources.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
