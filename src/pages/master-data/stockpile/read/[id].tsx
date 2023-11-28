import { ReadStockpileMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadStockpileMaster = () => {
  return <ReadStockpileMasterPage />;
};

export default ReadStockpileMaster;

ReadStockpileMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
