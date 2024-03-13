import { ReadMapMonthlyProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadMapMonthlyProduction = () => {
  return <ReadMapMonthlyProductionPage />;
};

export default ReadMapMonthlyProduction;

ReadMapMonthlyProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
