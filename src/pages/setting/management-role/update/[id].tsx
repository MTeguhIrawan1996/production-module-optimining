import { UpdateManagementRolePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateManagementRole = () => {
  return <UpdateManagementRolePage />;
};

export default UpdateManagementRole;

UpdateManagementRole.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
