import { ReadRitageOrePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadRitageOre = () => {
  return <ReadRitageOrePage />;
};

export default ReadRitageOre;

ReadRitageOre.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
