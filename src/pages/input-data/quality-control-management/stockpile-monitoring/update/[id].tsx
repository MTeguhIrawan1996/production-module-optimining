import { UpdateStockpileMonitoringPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateStockpileMonitoring = () => {
  return <UpdateStockpileMonitoringPage />;
};

export default UpdateStockpileMonitoring;

UpdateStockpileMonitoring.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
