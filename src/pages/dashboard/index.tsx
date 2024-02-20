// const Breadcrumbs = dynamic(
//   () => import('main/components').then((v) => v.Breadcrumbs),
//   {
//     ssr: false,
//   }
// );

import { DashboardPage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const Dashboard = () => {
  return <DashboardPage />;
};

export default Dashboard;

Dashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

// export const getStaticProps = async ({ locale }) => ({
//   props: {
//     ...(await serverSideTranslations(locale ?? 'id', ['common'])),
//   },
// });
