import { UpdateCompanyHeavyEquipmentPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateCompanyHeavyEquipment = () => {
  return <UpdateCompanyHeavyEquipmentPage />;
};

export default UpdateCompanyHeavyEquipment;

UpdateCompanyHeavyEquipment.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
