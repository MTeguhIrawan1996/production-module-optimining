import { ReadHeavyEquipmentPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadHeavyEquipment = () => {
  return <ReadHeavyEquipmentPage />;
};

export default ReadHeavyEquipment;

ReadHeavyEquipment.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
