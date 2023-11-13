import { ReadCompanyHeavyEquipmentPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadCompanyHeavyEquipment = () => {
  return <ReadCompanyHeavyEquipmentPage />;
};

export default ReadCompanyHeavyEquipment;

ReadCompanyHeavyEquipment.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
