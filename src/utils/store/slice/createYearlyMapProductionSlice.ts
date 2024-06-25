import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IYearlyMapProductionState = {
  page: number;
  search: string;
  mapYearlyCategory: string | null;
  mapYearlyLocation: string | null;
  year: number | null;
};

export type IYearlyMapProductionStateValue = {
  yearlyMapProductionState: IYearlyMapProductionState;
};

export interface IYearlyMapProductionStateAction {
  setYearlyMapProductionState: (
    payload: Partial<IYearlyMapProductionState>
  ) => void;
  resetYearlyMapProductionState: () => void;
}

const initialState: IYearlyMapProductionStateValue = {
  yearlyMapProductionState: {
    page: 1,
    search: '',
    mapYearlyCategory: null,
    mapYearlyLocation: null,
    year: null,
  },
};

export const createYearlyMapProductionSlice: StateCreator<
  IYearlyMapProductionStateValue & IYearlyMapProductionStateAction
> = (set) => {
  const sliceName = 'yearlyMapProductionSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setYearlyMapProductionState: (payload) =>
      set((state) => ({
        yearlyMapProductionState: {
          ...state.yearlyMapProductionState,
          ...payload,
        },
      })),
    resetYearlyMapProductionState: () => {
      set(initialState);
    },
  };
};
