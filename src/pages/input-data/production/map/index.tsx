import { MapProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const MapProduction = () => {
  return <MapProductionPage />;
};

export default MapProduction;

MapProduction.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
