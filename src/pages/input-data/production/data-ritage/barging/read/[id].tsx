import { ReadRitageBargingPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadRitageBarging = () => {
  return <ReadRitageBargingPage />;
};

export default ReadRitageBarging;

ReadRitageBarging.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
