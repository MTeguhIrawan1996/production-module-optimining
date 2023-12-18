import { UpdateRitageMovingPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateRitageMoving = () => {
  return <UpdateRitageMovingPage />;
};

export default UpdateRitageMoving;

UpdateRitageMoving.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
