import { UploadHeavyEquipmentProductionPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UploadHeavyEquipmentProduction = () => {
  return <UploadHeavyEquipmentProductionPage />;
};

export default UploadHeavyEquipmentProduction;

UploadHeavyEquipmentProduction.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
