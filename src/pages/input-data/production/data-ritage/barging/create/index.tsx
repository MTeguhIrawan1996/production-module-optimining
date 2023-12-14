import { CreateRitageBargingPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateRitageBarging = () => {
  return <CreateRitageBargingPage />;
};

export default CreateRitageBarging;

CreateRitageBarging.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
