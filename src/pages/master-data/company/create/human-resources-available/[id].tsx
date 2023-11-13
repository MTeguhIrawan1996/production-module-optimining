import { CreateHumanResourcesAvailablePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateCompanyHumanResourceAvailable = () => {
  return <CreateHumanResourcesAvailablePage />;
};

export default CreateCompanyHumanResourceAvailable;

CreateCompanyHumanResourceAvailable.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
