import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IManagementRoleState = {
  page: number;
  search: string;
};

export type IManagementRoleStateValue = {
  managementRoleState: IManagementRoleState;
};

export interface IManagementRoleStateAction {
  setManagementRoleState: (payload: Partial<IManagementRoleState>) => void;
  resetManagementRoleState: () => void;
}

const initialState: IManagementRoleStateValue = {
  managementRoleState: {
    page: 1,
    search: '',
  },
};

export const createManagementRoleSlice: StateCreator<
  IManagementRoleStateValue & IManagementRoleStateAction
> = (set) => {
  const sliceName = 'managementRoleSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setManagementRoleState: (payload) =>
      set((state) => ({
        managementRoleState: {
          ...state.managementRoleState,
          ...payload,
        },
      })),
    resetManagementRoleState: () => {
      set(initialState);
    },
  };
};
