import { ReadHeavyEquipmentProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadHeavyEquipmentProduction = () => {
  return <ReadHeavyEquipmentProductionPage />;
};

export default ReadHeavyEquipmentProduction;

ReadHeavyEquipmentProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
