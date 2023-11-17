import { ReadWorkingHoursPlanMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadWorkingHoursPlanMaster = () => {
  return <ReadWorkingHoursPlanMasterPage />;
};

export default ReadWorkingHoursPlanMaster;

ReadWorkingHoursPlanMaster.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
