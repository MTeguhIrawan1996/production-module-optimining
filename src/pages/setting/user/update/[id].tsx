import { UpdateUserPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateUser = () => {
  return <UpdateUserPage />;
};

export default UpdateUser;

UpdateUser.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
