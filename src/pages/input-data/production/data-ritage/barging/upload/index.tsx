import { UploadRitageBargingPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UploadRitageBarging = () => {
  return <UploadRitageBargingPage />;
};

export default UploadRitageBarging;

UploadRitageBarging.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
