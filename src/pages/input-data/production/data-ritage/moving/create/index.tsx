import { CreateRitageMovingPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateRitageMoving = () => {
  return <CreateRitageMovingPage />;
};

export default CreateRitageMoving;

CreateRitageMoving.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
