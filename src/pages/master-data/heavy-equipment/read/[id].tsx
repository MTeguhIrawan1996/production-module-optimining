import { ReadHeavyEquipmentMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadHeavyEquipmentMaster = () => {
  return <ReadHeavyEquipmentMasterPage />;
};

export default ReadHeavyEquipmentMaster;

ReadHeavyEquipmentMaster.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
