import { WeatherProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const WeatherProduction = () => {
  return <WeatherProductionPage />;
};

export default WeatherProduction;

WeatherProduction.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
