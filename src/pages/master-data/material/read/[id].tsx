import { ReadMaterialMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadLocationMaster = () => {
  return <ReadMaterialMasterPage />;
};

export default ReadLocationMaster;

ReadLocationMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
