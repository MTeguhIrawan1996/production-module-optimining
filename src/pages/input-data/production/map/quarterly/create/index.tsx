import { CreateMapQuarterlyProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateMapQuarterlyProduction = () => {
  return <CreateMapQuarterlyProductionPage />;
};

export default CreateMapQuarterlyProduction;

CreateMapQuarterlyProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
