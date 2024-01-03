import { ReadWeatherProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadWeatherProduction = () => {
  return <ReadWeatherProductionPage />;
};

export default ReadWeatherProduction;

ReadWeatherProduction.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
