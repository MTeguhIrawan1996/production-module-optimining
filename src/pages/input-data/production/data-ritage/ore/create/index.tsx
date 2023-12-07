import { CreateRitageOrePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateRitageOre = () => {
  return <CreateRitageOrePage />;
};

export default CreateRitageOre;

CreateRitageOre.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
