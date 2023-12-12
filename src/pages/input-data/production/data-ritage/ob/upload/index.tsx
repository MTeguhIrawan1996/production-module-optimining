import { UploadRitageObPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UploadRitageOb = () => {
  return <UploadRitageObPage />;
};

export default UploadRitageOb;

UploadRitageOb.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
