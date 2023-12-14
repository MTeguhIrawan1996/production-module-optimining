import { ReadDTQuarryRitagePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadQuarryDumpTruck = () => {
  return <ReadDTQuarryRitagePage />;
};

export default ReadQuarryDumpTruck;

ReadQuarryDumpTruck.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
