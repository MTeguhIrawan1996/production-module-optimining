import { ShiftMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ShiftMaster = () => {
  return <ShiftMasterPage />;
};

export default ShiftMaster;

ShiftMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
