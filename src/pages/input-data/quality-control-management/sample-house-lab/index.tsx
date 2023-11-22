import { SampleHouseLabPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const SampleHouseLab = () => {
  return <SampleHouseLabPage />;
};

export default SampleHouseLab;

SampleHouseLab.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
