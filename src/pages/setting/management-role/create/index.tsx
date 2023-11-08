import { CreateManagementRolePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateManagementRole = () => {
  return <CreateManagementRolePage />;
};

export default CreateManagementRole;

CreateManagementRole.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
