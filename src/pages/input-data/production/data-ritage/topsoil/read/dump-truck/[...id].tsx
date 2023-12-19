import { ReadDTTopsoilRitagePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadTopsoilDumpTruck = () => {
  return <ReadDTTopsoilRitagePage />;
};

export default ReadTopsoilDumpTruck;

ReadTopsoilDumpTruck.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
