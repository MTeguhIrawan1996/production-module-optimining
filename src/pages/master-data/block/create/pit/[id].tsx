import { CreateBlockPitMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateBlockPitMaster = () => {
  return <CreateBlockPitMasterPage />;
};

export default CreateBlockPitMaster;

CreateBlockPitMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
