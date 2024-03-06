import { ReadStockpileMonitoringPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadStockpileMonitoring = () => {
  return <ReadStockpileMonitoringPage />;
};

export default ReadStockpileMonitoring;

ReadStockpileMonitoring.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
