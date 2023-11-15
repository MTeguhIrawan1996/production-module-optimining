import { UpdateCompanyPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const UpdateCompany = () => {
  return <UpdateCompanyPage />;
};

export default UpdateCompany;

UpdateCompany.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
