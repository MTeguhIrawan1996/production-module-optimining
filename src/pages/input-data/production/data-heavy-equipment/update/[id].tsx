import { UpdateHeavyEquipmentProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateHeavyEquipmentProduction = () => {
  return <UpdateHeavyEquipmentProductionPage />;
};

export default UpdateHeavyEquipmentProduction;

UpdateHeavyEquipmentProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
