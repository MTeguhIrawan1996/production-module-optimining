import { CreateMapYearlyProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateMapYearlyProduction = () => {
  return <CreateMapYearlyProductionPage />;
};

export default CreateMapYearlyProduction;

CreateMapYearlyProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
