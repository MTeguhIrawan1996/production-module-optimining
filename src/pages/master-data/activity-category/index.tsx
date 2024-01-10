import { ActivityCategoryMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ActivityCategoryMaster = () => {
  return <ActivityCategoryMasterPage />;
};

export default ActivityCategoryMaster;

ActivityCategoryMaster.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
