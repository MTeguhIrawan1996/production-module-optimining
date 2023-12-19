import { UploadRitageTopsoilPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UploadRitageTopsoil = () => {
  return <UploadRitageTopsoilPage />;
};

export default UploadRitageTopsoil;

UploadRitageTopsoil.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
