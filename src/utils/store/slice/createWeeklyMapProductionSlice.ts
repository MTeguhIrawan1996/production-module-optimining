import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IWeeklyMapProductionState = {
  page: number;
  search: string;
  mapWeeklyCategory: string | null;
  mapWeeklyLocation: string | null;
  year: number | null;
  week: number | null;
  filterBadgeValue: string[] | null;
};

export type IWeeklyMapProductionStateValue = {
  weeklyMapProductionState: IWeeklyMapProductionState;
};

export interface IWeeklyMapProductionStateAction {
  setWeeklyMapProductionState: (
    payload: Partial<IWeeklyMapProductionState>
  ) => void;
  resetWeeklyMapProductionState: () => void;
}

const initialState: IWeeklyMapProductionStateValue = {
  weeklyMapProductionState: {
    page: 1,
    search: '',
    mapWeeklyCategory: null,
    mapWeeklyLocation: null,
    week: null,
    year: null,
    filterBadgeValue: null,
  },
};

export const createWeeklyMapProductionSlice: StateCreator<
  IWeeklyMapProductionStateValue & IWeeklyMapProductionStateAction
> = (set) => {
  const sliceName = 'weeklyMapProductionSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setWeeklyMapProductionState: (payload) =>
      set((state) => ({
        weeklyMapProductionState: {
          ...state.weeklyMapProductionState,
          ...payload,
        },
      })),
    resetWeeklyMapProductionState: () => {
      set(initialState);
    },
  };
};
