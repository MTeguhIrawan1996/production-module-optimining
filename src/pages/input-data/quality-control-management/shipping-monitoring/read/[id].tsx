import { ReadShippingMonitoringPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadShippingMonitoring = () => {
  return <ReadShippingMonitoringPage />;
};

export default ReadShippingMonitoring;

ReadShippingMonitoring.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
