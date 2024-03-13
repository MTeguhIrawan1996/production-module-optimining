import { ReadMapQuarterlyProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadMapQuarterlyProduction = () => {
  return <ReadMapQuarterlyProductionPage />;
};

export default ReadMapQuarterlyProduction;

ReadMapQuarterlyProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
