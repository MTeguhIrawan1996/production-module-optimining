import { WorkingHoursPlanMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const WorkingHoursPlanMaster = () => {
  return <WorkingHoursPlanMasterPage />;
};

export default WorkingHoursPlanMaster;

WorkingHoursPlanMaster.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
