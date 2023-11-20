import { ReadShiftMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadShiftMaster = () => {
  return <ReadShiftMasterPage />;
};

export default ReadShiftMaster;

ReadShiftMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
