import { UpdateLoseTimeActivityPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateLoseTimeActivity = () => {
  return <UpdateLoseTimeActivityPage />;
};

export default UpdateLoseTimeActivity;

UpdateLoseTimeActivity.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
