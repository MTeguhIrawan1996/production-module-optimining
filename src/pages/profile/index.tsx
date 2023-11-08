import { ProfilePage } from '@/components/features';
import { DashboardLayout } from '@/components/layouts';

const Profile = () => {
  return <ProfilePage />;
};

export default Profile;

Profile.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
