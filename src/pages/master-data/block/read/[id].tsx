import { ReadBlockMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadBlockMaster = () => {
  return <ReadBlockMasterPage />;
};

export default ReadBlockMaster;

ReadBlockMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
