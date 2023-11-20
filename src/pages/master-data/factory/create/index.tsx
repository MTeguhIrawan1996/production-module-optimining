import { CreateFactoryMasterPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateFactoryMaster = () => {
  return <CreateFactoryMasterPage />;
};

export default CreateFactoryMaster;

CreateFactoryMaster.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
