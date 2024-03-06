import { ReadFrontProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadFrontProduction = () => {
  return <ReadFrontProductionPage />;
};

export default ReadFrontProduction;

ReadFrontProduction.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
