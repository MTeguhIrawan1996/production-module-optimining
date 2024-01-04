import { WeatherProductionProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const WeatherProductionProduction = () => {
  return <WeatherProductionProductionPage />;
};

export default WeatherProductionProduction;

WeatherProductionProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
