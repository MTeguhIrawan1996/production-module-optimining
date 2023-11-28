import { CreateStockpileDomeMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateStockpileDomeMaster = () => {
  return <CreateStockpileDomeMasterPage />;
};

export default CreateStockpileDomeMaster;

CreateStockpileDomeMaster.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
