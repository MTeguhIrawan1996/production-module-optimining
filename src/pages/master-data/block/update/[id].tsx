import { UpdateBlockMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateBlockMaster = () => {
  return <UpdateBlockMasterPage />;
};

export default UpdateBlockMaster;

UpdateBlockMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
