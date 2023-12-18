import { CreateRitageTopsoilPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateRitageTopsoil = () => {
  return <CreateRitageTopsoilPage />;
};

export default CreateRitageTopsoil;

CreateRitageTopsoil.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
