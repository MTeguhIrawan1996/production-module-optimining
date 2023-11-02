import { FormExamplePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const FormExample = () => {
  return <FormExamplePage />;
};

export default FormExample;

FormExample.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
