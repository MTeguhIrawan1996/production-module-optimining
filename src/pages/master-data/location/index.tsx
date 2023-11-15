import { LocationPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const Location = () => {
  return <LocationPage />;
};

export default Location;

Location.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
