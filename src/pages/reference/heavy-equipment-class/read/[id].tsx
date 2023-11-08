import { ReadHeavyEquipmentClassPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadHeavyEquipmentClass = () => {
  return <ReadHeavyEquipmentClassPage />;
};

export default ReadHeavyEquipmentClass;

ReadHeavyEquipmentClass.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
