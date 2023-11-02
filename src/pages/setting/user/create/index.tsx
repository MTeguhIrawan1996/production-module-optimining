import { CreateUserPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateUser = () => {
  return <CreateUserPage />;
};

export default CreateUser;

CreateUser.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
