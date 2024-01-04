import { ShippingMonitoringPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ShippingMonitoring = () => {
  return <ShippingMonitoringPage />;
};

export default ShippingMonitoring;

ShippingMonitoring.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
