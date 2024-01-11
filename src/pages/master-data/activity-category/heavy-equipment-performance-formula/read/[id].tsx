import { ReadHeavyEquipmentFormulaPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadHeavyEquipmentFormula = () => {
  return <ReadHeavyEquipmentFormulaPage />;
};

export default ReadHeavyEquipmentFormula;

ReadHeavyEquipmentFormula.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
