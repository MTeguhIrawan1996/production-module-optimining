import { UpdateWeatherProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateWeatherProduction = () => {
  return <UpdateWeatherProductionPage />;
};

export default UpdateWeatherProduction;

UpdateWeatherProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
