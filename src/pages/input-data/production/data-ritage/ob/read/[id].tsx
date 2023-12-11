import { ReadRitageObPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadRitageOb = () => {
  return <ReadRitageObPage />;
};

export default ReadRitageOb;

ReadRitageOb.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
