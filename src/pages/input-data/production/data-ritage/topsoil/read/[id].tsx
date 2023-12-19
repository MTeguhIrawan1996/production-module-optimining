import { ReadRitageTopsoilPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadRitageTopsoil = () => {
  return <ReadRitageTopsoilPage />;
};

export default ReadRitageTopsoil;

ReadRitageTopsoil.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
