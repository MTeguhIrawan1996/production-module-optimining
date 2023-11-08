import { CompanyTypePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const CompanyType = () => {
  return <CompanyTypePage />;
};

export default CompanyType;

CompanyType.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
