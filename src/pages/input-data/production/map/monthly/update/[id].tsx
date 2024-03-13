import { UpdateMapMonthlyProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateMapMonthlyProduction = () => {
  return <UpdateMapMonthlyProductionPage />;
};

export default UpdateMapMonthlyProduction;

UpdateMapMonthlyProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
