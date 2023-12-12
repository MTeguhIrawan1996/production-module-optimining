import { ReadDTObRitagePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadObDumpTruck = () => {
  return <ReadDTObRitagePage />;
};

export default ReadObDumpTruck;

ReadObDumpTruck.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
