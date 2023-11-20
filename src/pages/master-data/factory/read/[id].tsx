import { ReadFactoryMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadFactoryMaster = () => {
  return <ReadFactoryMasterPage />;
};

export default ReadFactoryMaster;

ReadFactoryMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
