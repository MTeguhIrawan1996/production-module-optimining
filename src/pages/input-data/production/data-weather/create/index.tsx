import { CreateWeatherProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateWeatherProduction = () => {
  return <CreateWeatherProductionPage />;
};

export default CreateWeatherProduction;

CreateWeatherProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
