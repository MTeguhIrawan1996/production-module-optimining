import { UpdateMaterialMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateMaterialMaster = () => {
  return <UpdateMaterialMasterPage />;
};

export default UpdateMaterialMaster;

UpdateMaterialMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
