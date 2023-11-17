import { UpdateWorkingHoursPlanMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateWorkingHoursPlanMaster = () => {
  return <UpdateWorkingHoursPlanMasterPage />;
};

export default UpdateWorkingHoursPlanMaster;

UpdateWorkingHoursPlanMaster.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
