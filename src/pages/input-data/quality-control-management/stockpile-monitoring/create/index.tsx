import { CreateStockpilePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateStockpile = () => {
  return <CreateStockpilePage />;
};

export default CreateStockpile;

CreateStockpile.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
