import { ReadDTBargingRitagePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadBargingDumpTruck = () => {
  return <ReadDTBargingRitagePage />;
};

export default ReadBargingDumpTruck;

ReadBargingDumpTruck.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
