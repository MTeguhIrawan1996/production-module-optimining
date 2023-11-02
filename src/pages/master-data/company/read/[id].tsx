import { ReadCompanyPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const ReadCompany = () => {
  return <ReadCompanyPage />;
};

export default ReadCompany;

ReadCompany.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
