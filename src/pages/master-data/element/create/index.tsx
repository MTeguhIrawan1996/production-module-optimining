import { CreateElementMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateElementMaster = () => {
  return <CreateElementMasterPage />;
};

export default CreateElementMaster;

CreateElementMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
