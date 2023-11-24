import { CreateSmapleHouseLabPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateSmapleHouseLab = () => {
  return <CreateSmapleHouseLabPage />;
};

export default CreateSmapleHouseLab;

CreateSmapleHouseLab.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
