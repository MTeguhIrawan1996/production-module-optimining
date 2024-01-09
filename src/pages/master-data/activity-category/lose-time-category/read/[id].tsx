import { ReadLoseTimeCategoryPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadLoseTimeCategory = () => {
  return <ReadLoseTimeCategoryPage />;
};

export default ReadLoseTimeCategory;

ReadLoseTimeCategory.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
