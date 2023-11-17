import { CreateActivityPlanMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateActivityPlanMaster = () => {
  return <CreateActivityPlanMasterPage />;
};

export default CreateActivityPlanMaster;

CreateActivityPlanMaster.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
