import { StockpileMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const StockpileMaster = () => {
  return <StockpileMasterPage />;
};

export default StockpileMaster;

StockpileMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
