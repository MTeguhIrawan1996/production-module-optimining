import { CreateMaterialMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateMaterialMaster = () => {
  return <CreateMaterialMasterPage />;
};

export default CreateMaterialMaster;

CreateMaterialMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
