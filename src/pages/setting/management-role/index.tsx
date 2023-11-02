import { ManagementRolePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ManagementRole = () => {
  return <ManagementRolePage />;
};

export default ManagementRole;

ManagementRole.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
