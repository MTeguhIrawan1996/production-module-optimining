import { ReadRitageMovingPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadRitageMoving = () => {
  return <ReadRitageMovingPage />;
};

export default ReadRitageMoving;

ReadRitageMoving.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
