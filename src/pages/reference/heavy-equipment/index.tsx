import { HeavyEquipmentPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const HeavyEquipment = () => {
  return <HeavyEquipmentPage />;
};

export default HeavyEquipment;

HeavyEquipment.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
