import { UpdateRitageBargingPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateRitageBarging = () => {
  return <UpdateRitageBargingPage />;
};

export default UpdateRitageBarging;

UpdateRitageBarging.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
