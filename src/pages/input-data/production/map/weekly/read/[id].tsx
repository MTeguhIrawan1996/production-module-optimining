import { ReadMapWeeklyProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadMapWeeklyProduction = () => {
  return <ReadMapWeeklyProductionPage />;
};

export default ReadMapWeeklyProduction;

ReadMapWeeklyProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
