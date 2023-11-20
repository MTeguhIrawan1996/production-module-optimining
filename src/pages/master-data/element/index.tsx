import { ElementMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ElementMaster = () => {
  return <ElementMasterPage />;
};

export default ElementMaster;

ElementMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
