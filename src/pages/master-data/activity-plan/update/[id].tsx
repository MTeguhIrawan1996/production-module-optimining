import { UpdateActivityPlanMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateActivityPlanMaster = () => {
  return <UpdateActivityPlanMasterPage />;
};

export default UpdateActivityPlanMaster;

UpdateActivityPlanMaster.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
