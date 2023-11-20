import { FactoryMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const FactoryMaster = () => {
  return <FactoryMasterPage />;
};

export default FactoryMaster;

FactoryMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
