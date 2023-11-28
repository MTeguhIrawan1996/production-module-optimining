import { CreateStockpileMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateStockpileMaster = () => {
  return <CreateStockpileMasterPage />;
};

export default CreateStockpileMaster;

CreateStockpileMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
