// import { DashboardLayout } from '@/components/layouts';
import dynamic from 'next/dynamic';

import { HeavyEquipmentClassPage } from '@/components/features';
const DashboardLayout = dynamic(() => import('main/DashboardLayout'), {
  ssr: false,
});
const HeavyEquipmentClass = () => {
  return <HeavyEquipmentClassPage />;
};

export default HeavyEquipmentClass;

HeavyEquipmentClass.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
