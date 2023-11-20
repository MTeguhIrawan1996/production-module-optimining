import { ReadElementMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadElementMaster = () => {
  return <ReadElementMasterPage />;
};

export default ReadElementMaster;

ReadElementMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
