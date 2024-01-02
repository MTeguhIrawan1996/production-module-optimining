import { CreateHeavyEquipmentProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateHeavyEquipmentProduction = () => {
  return <CreateHeavyEquipmentProductionPage />;
};

export default CreateHeavyEquipmentProduction;

CreateHeavyEquipmentProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
