import { CreateMapWeeklyProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateMapWeeklyProduction = () => {
  return <CreateMapWeeklyProductionPage />;
};

export default CreateMapWeeklyProduction;

CreateMapWeeklyProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
