import { CreateShiftMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateShiftMaster = () => {
  return <CreateShiftMasterPage />;
};

export default CreateShiftMaster;

CreateShiftMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
