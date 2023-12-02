import { UpdateRitageOrePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateRitageOre = () => {
  return <UpdateRitageOrePage />;
};

export default UpdateRitageOre;

UpdateRitageOre.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
