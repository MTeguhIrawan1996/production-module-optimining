import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IWHPState = {
  page: number;
  search: string;
};

export type IWHPSliceValue = {
  whpState: IWHPState;
};

export interface IWHPSliceAction {
  setWHPPage: (payload: Pick<IWHPState, 'page'>) => void;
  setSearchWHP: (payload: Pick<IWHPState, 'search'>) => void;
  resetWHP: () => void;
}

const initialState: IWHPSliceValue = {
  whpState: {
    page: 1,
    search: '',
  },
};

export const createWHPSlice: StateCreator<IWHPSliceValue & IWHPSliceAction> = (
  set
) => {
  sliceResetFns.add(() => set(initialState));
  return {
    ...initialState,
    setSearchWHP: (payload) =>
      set((state) => ({
        whpState: {
          ...state.whpState,
          search: payload.search,
        },
      })),
    setWHPPage: (payload) =>
      set((state) => ({
        whpState: {
          ...state.whpState,
          page: payload.page,
        },
      })),
    resetWHP: () => {
      set(initialState);
    },
  };
};
