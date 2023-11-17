import { ReadLocationMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadLocationMaster = () => {
  return <ReadLocationMasterPage />;
};

export default ReadLocationMaster;

ReadLocationMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
