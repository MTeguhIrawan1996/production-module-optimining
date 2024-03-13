import { ReadMapYearlyProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadMapYearlyProduction = () => {
  return <ReadMapYearlyProductionPage />;
};

export default ReadMapYearlyProduction;

ReadMapYearlyProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
