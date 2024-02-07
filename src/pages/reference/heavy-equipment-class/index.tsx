import { HeavyEquipmentClassPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const HeavyEquipmentClass = () => {
  return <HeavyEquipmentClassPage />;
};

export default HeavyEquipmentClass;

HeavyEquipmentClass.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
