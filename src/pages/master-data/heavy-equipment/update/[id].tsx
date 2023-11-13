import { UpdateHeavyEquipmentMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateHeavyEquipmentMaster = () => {
  return <UpdateHeavyEquipmentMasterPage />;
};

export default UpdateHeavyEquipmentMaster;

UpdateHeavyEquipmentMaster.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
