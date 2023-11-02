import { ReadManagementRolePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadManagementRole = () => {
  return <ReadManagementRolePage />;
};

export default ReadManagementRole;

ReadManagementRole.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
