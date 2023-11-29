import { UpdateStockpileMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateStockpileMaster = () => {
  return <UpdateStockpileMasterPage />;
};

export default UpdateStockpileMaster;

UpdateStockpileMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
