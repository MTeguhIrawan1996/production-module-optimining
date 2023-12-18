import { ReadDTMovingRitagePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadMovingDumpTruck = () => {
  return <ReadDTMovingRitagePage />;
};

export default ReadMovingDumpTruck;

ReadMovingDumpTruck.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
