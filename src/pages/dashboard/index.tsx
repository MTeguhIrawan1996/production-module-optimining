import dynamic from 'next/dynamic';

import { DashboardPage } from '@/components/features';
// import { DashboardLayout } from '@/components/layouts';

const DashboardLayout = dynamic(() => import('main/DashboardLayout'), {
  ssr: false,
});

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
