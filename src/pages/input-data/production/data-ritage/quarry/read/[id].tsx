import { ReadRitageQuarryPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadRitageQuarry = () => {
  return <ReadRitageQuarryPage />;
};

export default ReadRitageQuarry;

ReadRitageQuarry.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
