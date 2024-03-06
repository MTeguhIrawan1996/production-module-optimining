import { UpdateHeavyEquipmentFormulaPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateHeavyEquipmentFormula = () => {
  return <UpdateHeavyEquipmentFormulaPage />;
};

export default UpdateHeavyEquipmentFormula;

UpdateHeavyEquipmentFormula.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
