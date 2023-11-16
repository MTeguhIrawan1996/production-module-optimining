import { CreateLocationMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateLocationMaster = () => {
  return <CreateLocationMasterPage />;
};

export default CreateLocationMaster;

CreateLocationMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
