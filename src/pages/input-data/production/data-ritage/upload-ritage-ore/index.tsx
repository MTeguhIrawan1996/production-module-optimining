import { UploadRitageOrePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UploadRitageOre = () => {
  return <UploadRitageOrePage />;
};

export default UploadRitageOre;

UploadRitageOre.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
