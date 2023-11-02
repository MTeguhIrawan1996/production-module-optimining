import { CreateCompanyPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CreateCompany = () => {
  return <CreateCompanyPage />;
};

export default CreateCompany;

CreateCompany.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
