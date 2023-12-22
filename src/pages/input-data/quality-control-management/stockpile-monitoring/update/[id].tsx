import { UpdateStockpileMonitoringPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateStockpile = () => {
  return <UpdateStockpileMonitoringPage />;
};

export default UpdateStockpile;

UpdateStockpile.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
