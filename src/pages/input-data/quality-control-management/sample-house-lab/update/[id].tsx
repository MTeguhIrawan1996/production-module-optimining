import { UpdateSampleHouseLabPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateSampleHouseLab = () => {
  return <UpdateSampleHouseLabPage />;
};

export default UpdateSampleHouseLab;

UpdateSampleHouseLab.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
