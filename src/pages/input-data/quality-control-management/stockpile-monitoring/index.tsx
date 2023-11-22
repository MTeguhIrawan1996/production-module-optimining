import { StockpilePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const Stockpile = () => {
  return <StockpilePage />;
};

export default Stockpile;

Stockpile.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
