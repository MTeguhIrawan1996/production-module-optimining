import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IMonthlyMapProductionState = {
  page: number;
  search: string;
  mapMonthlyCategory: string | null;
  mapMonthlyLocation: string | null;
  year: number | null;
  month: number | null;
  filterBadgeValue: string[] | null;
};

export type IMonthlyMapProductionStateValue = {
  monthlyMapProductionState: IMonthlyMapProductionState;
};

export interface IMonthlyMapProductionStateAction {
  setMonthlyMapProductionState: (
    payload: Partial<IMonthlyMapProductionState>
  ) => void;
  resetMonthlyMapProductionState: () => void;
}

const initialState: IMonthlyMapProductionStateValue = {
  monthlyMapProductionState: {
    page: 1,
    search: '',
    mapMonthlyCategory: null,
    mapMonthlyLocation: null,
    year: null,
    month: null,
    filterBadgeValue: null,
  },
};

export const createMonthlyMapProductionSlice: StateCreator<
  IMonthlyMapProductionStateValue & IMonthlyMapProductionStateAction
> = (set) => {
  const sliceName = 'monthlyMapProductionSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setMonthlyMapProductionState: (payload) =>
      set((state) => ({
        monthlyMapProductionState: {
          ...state.monthlyMapProductionState,
          ...payload,
        },
      })),
    resetMonthlyMapProductionState: () => {
      set(initialState);
    },
  };
};
