import { CreateCalculationCategoryPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateCalculationCategory = () => {
  return <CreateCalculationCategoryPage />;
};

export default CreateCalculationCategory;

CreateCalculationCategory.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
