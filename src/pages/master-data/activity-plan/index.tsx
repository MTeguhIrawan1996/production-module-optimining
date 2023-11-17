import { ActivityPlanMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ActivityPlanMaster = () => {
  return <ActivityPlanMasterPage />;
};

export default ActivityPlanMaster;

ActivityPlanMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
