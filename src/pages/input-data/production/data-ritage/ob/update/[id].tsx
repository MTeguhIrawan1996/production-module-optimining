import { UpdateRitageObPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateRitageOb = () => {
  return <UpdateRitageObPage />;
};

export default UpdateRitageOb;

UpdateRitageOb.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
