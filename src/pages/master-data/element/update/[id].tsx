import { UpdateElementMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateElementMaster = () => {
  return <UpdateElementMasterPage />;
};

export default UpdateElementMaster;

UpdateElementMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
