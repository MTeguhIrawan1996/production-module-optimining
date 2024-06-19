import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IWHPState = {
  page: number;
  searchWHP: string;
};

export type IWHPSliceValue = {
  whpState: IWHPState;
};

export interface IWHPSliceAction {
  setWHPPage: (payload: Pick<IWHPState, 'page'>) => void;
  setSearchWHP: (payload: Pick<IWHPState, 'searchWHP'>) => void;
  resetWHP: () => void;
}

const initialState: IWHPSliceValue = {
  whpState: {
    page: 1,
    searchWHP: '',
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
          searchWHP: payload.searchWHP,
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
