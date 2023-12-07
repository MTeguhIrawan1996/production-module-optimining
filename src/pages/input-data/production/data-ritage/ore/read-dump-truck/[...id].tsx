import { ReadOreDumpTruckPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadOreDumpTruck = () => {
  return <ReadOreDumpTruckPage />;
};

export default ReadOreDumpTruck;

ReadOreDumpTruck.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
