import { ReadCalculationCategoryPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadCalculationCategory = () => {
  return <ReadCalculationCategoryPage />;
};

export default ReadCalculationCategory;

ReadCalculationCategory.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
