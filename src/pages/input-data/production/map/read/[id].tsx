import { ReadMapProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadMapProduction = () => {
  return <ReadMapProductionPage />;
};

export default ReadMapProduction;

ReadMapProduction.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
