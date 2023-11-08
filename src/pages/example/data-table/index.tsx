import { DataTablePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const Dashboard = () => {
  return <DataTablePage />;
};

export default Dashboard;

Dashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
