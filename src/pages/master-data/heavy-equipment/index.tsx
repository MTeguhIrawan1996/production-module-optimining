import { HeavyEquipmentMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const HeavyEquipmentMaster = () => {
  return <HeavyEquipmentMasterPage />;
};

export default HeavyEquipmentMaster;

HeavyEquipmentMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
