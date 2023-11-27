import { CreateBlocakMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateBlocakMaster = () => {
  return <CreateBlocakMasterPage />;
};

export default CreateBlocakMaster;

CreateBlocakMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
