import { MaterialMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const MaterialMaster = () => {
  return <MaterialMasterPage />;
};

export default MaterialMaster;

MaterialMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
