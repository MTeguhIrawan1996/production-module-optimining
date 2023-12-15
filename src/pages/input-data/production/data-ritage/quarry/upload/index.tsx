import { UploadRitageQuarryPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UploadRitageQuarry = () => {
  return <UploadRitageQuarryPage />;
};

export default UploadRitageQuarry;

UploadRitageQuarry.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
