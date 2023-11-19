import { UpdateShiftMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateShiftMaster = () => {
  return <UpdateShiftMasterPage />;
};

export default UpdateShiftMaster;

UpdateShiftMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
