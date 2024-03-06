import { FrontProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const FrontProduction = () => {
  return <FrontProductionPage />;
};

export default FrontProduction;

FrontProduction.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
