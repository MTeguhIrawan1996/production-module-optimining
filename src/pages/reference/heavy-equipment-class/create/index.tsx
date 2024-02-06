import dynamic from 'next/dynamic';

import { CreateHeavyEquipmentClassPage } from '@/components/features';
const DashboardLayout = dynamic(() => import('main/DashboardLayout'), {
  ssr: false,
});

const CreateHeavyEquipmentClass = () => {
  return <CreateHeavyEquipmentClassPage />;
};

export default CreateHeavyEquipmentClass;

CreateHeavyEquipmentClass.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
