import { UpdateShippingMonitoringPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateShippingMonitoring = () => {
  return <UpdateShippingMonitoringPage />;
};

export default UpdateShippingMonitoring;

UpdateShippingMonitoring.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
