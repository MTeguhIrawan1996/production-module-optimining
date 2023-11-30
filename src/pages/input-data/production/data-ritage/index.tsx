import { DataRitagePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const DataRitage = () => {
  return <DataRitagePage />;
};

export default DataRitage;

DataRitage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
