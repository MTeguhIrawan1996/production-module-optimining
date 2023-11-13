import { CreateCompanyHeavyEquipmentPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateCompanyHeavyEquipment = () => {
  return <CreateCompanyHeavyEquipmentPage />;
};

export default CreateCompanyHeavyEquipment;

CreateCompanyHeavyEquipment.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
