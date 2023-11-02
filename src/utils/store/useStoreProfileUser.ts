import { create } from 'zustand';

type IGetUserData = {
  name: string;
};

interface ProfileUser {
  profileUser: IGetUserData | undefined;
  setProfileUser: (role: IGetUserData) => void;
}

export const useStoreProfileUser = create<ProfileUser>((set) => ({
  profileUser: undefined,
  setProfileUser: (profileUser: IGetUserData) => set({ profileUser }),
}));
