import { UpdateLocationMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateLocationMaster = () => {
  return <UpdateLocationMasterPage />;
};

export default UpdateLocationMaster;

UpdateLocationMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
