import { DashboardLayout } from '@/components/layouts';

const UpdateWeeklyPlanGroup = () => {
  return <div className="">foo</div>;
};

export default UpdateWeeklyPlanGroup;

UpdateWeeklyPlanGroup.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
