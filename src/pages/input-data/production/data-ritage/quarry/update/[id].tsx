import { UpdateRitageQuarryPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateRitageQuarry = () => {
  return <UpdateRitageQuarryPage />;
};

export default UpdateRitageQuarry;

UpdateRitageQuarry.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
