import { UpdateBlockPitMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateBlockPitMaster = () => {
  return <UpdateBlockPitMasterPage />;
};

export default UpdateBlockPitMaster;

UpdateBlockPitMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
