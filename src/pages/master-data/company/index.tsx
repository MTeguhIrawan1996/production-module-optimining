import { CompanyPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const Company = () => {
  return <CompanyPage />;
};

export default Company;

Company.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
