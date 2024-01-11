import { UpdateCalculationCategoryPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateCalculationCategory = () => {
  return <UpdateCalculationCategoryPage />;
};

export default UpdateCalculationCategory;

UpdateCalculationCategory.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
