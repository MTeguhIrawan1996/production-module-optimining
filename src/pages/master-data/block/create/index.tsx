import { CreateBlockMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateBlockMaster = () => {
  return <CreateBlockMasterPage />;
};

export default CreateBlockMaster;

CreateBlockMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
