import { CreateHeavyEquipmentMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateHeavyEquipmentMaster = () => {
  return <CreateHeavyEquipmentMasterPage />;
};

export default CreateHeavyEquipmentMaster;

CreateHeavyEquipmentMaster.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
