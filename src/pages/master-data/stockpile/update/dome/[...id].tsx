import { UpdateStockpileDomeMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateStockpileDomeMaster = () => {
  return <UpdateStockpileDomeMasterPage />;
};

export default UpdateStockpileDomeMaster;

UpdateStockpileDomeMaster.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
