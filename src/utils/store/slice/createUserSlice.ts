import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IUserState = {
  page: number;
  search: string;
};

export type IUserStateValue = {
  userState: IUserState;
};

export interface IUserStateAction {
  setUserState: (payload: Partial<IUserState>) => void;
  resetUserState: () => void;
}

const initialState: IUserStateValue = {
  userState: {
    page: 1,
    search: '',
  },
};

export const createUserSlice: StateCreator<
  IUserStateValue & IUserStateAction
> = (set) => {
  const sliceName = 'userSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setUserState: (payload) =>
      set((state) => ({
        userState: {
          ...state.userState,
          ...payload,
        },
      })),
    resetUserState: () => {
      set(initialState);
    },
  };
};
