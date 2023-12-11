import { CreateRitageObPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateRitageOb = () => {
  return <CreateRitageObPage />;
};

export default CreateRitageOb;

CreateRitageOb.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
