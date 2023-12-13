import { CreateRitageQuarryPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateRitageQuarry = () => {
  return <CreateRitageQuarryPage />;
};

export default CreateRitageQuarry;

CreateRitageQuarry.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
