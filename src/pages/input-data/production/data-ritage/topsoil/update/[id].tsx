import { UpdateRitageTopsoilPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateRitageTopsoil = () => {
  return <UpdateRitageTopsoilPage />;
};

export default UpdateRitageTopsoil;

UpdateRitageTopsoil.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
