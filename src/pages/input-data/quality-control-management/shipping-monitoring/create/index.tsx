import { CreateShippingMonitoringPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateShippingMonitoring = () => {
  return <CreateShippingMonitoringPage />;
};

export default CreateShippingMonitoring;

CreateShippingMonitoring.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
