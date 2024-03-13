import { CreateMapMonthlyProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateMapMonthlyProduction = () => {
  return <CreateMapMonthlyProductionPage />;
};

export default CreateMapMonthlyProduction;

CreateMapMonthlyProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
