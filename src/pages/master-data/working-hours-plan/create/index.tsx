import { CreateWorkingHoursPlanMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateWorkingHoursPlanMaster = () => {
  return <CreateWorkingHoursPlanMasterPage />;
};

export default CreateWorkingHoursPlanMaster;

CreateWorkingHoursPlanMaster.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
