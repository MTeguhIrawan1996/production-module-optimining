import { HeavyEquipmentProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const HeavyEquipmentProduction = () => {
  return <HeavyEquipmentProductionPage />;
};

export default HeavyEquipmentProduction;

HeavyEquipmentProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
