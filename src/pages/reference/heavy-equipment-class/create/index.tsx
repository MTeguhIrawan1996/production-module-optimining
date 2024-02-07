import { CreateHeavyEquipmentClassPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateHeavyEquipmentClass = () => {
  return <CreateHeavyEquipmentClassPage />;
};

export default CreateHeavyEquipmentClass;

CreateHeavyEquipmentClass.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
