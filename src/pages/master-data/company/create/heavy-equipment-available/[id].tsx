import { CreateHeavyEquipmentAvailablePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateHeavyEquipmentAvailable = () => {
  return <CreateHeavyEquipmentAvailablePage />;
};

export default CreateHeavyEquipmentAvailable;

CreateHeavyEquipmentAvailable.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
