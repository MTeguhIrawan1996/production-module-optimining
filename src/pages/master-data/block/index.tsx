import { BlockPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const Block = () => {
  return <BlockPage />;
};

export default Block;

Block.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
