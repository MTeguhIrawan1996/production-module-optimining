import { UploadRitageMovingPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UploadRitageMoving = () => {
  return <UploadRitageMovingPage />;
};

export default UploadRitageMoving;

UploadRitageMoving.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
