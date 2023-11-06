import { UpdateHeavyEquipmentPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateHeavyEquipment = () => {
  return <UpdateHeavyEquipmentPage />;
};

export default UpdateHeavyEquipment;

UpdateHeavyEquipment.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
