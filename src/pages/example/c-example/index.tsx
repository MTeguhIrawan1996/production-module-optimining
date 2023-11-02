import { ComponentsPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ComponentsExample = () => {
  return <ComponentsPage />;
};

export default ComponentsExample;

ComponentsExample.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
