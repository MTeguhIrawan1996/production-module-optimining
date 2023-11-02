import { UserPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const User = () => {
  return <UserPage />;
};

export default User;

User.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
