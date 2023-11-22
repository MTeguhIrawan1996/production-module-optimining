import { ReadSampleHouseLabPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadSampleHouseLab = () => {
  return <ReadSampleHouseLabPage />;
};

export default ReadSampleHouseLab;

ReadSampleHouseLab.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
