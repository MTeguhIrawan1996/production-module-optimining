import { UpdateFactoryMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateFactoryMaster = () => {
  return <UpdateFactoryMasterPage />;
};

export default UpdateFactoryMaster;

UpdateFactoryMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
