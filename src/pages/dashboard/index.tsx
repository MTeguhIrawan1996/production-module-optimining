import { DashboardPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const Dashboard = () => {
  return <DashboardPage />;
};

export default Dashboard;

Dashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
