import { CreateHeavyEquipmentPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateHeavyEquipment = () => {
  return <CreateHeavyEquipmentPage />;
};

export default CreateHeavyEquipment;

CreateHeavyEquipment.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
