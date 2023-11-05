import { UpdateHeavyEquipmentClassPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateHeavyEquipmentClass = () => {
  return <UpdateHeavyEquipmentClassPage />;
};

export default UpdateHeavyEquipmentClass;

UpdateHeavyEquipmentClass.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
