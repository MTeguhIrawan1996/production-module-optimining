import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IWeeklyPlanState = {
  page: number;
  year: number | null;
  week: number | null;
  status: string | null;
  companyId: string | null;
  filterBadgeValue: string[] | null;
};

export type IWeeklyPlanValue = {
  weeklyPlanState: IWeeklyPlanState;
};

export interface IWeeklyPlanAction {
  setWeeklyPlanState: (payload: Partial<IWeeklyPlanState>) => void;
  resetWeeklyPlanState: () => void;
}

const initialState: IWeeklyPlanValue = {
  weeklyPlanState: {
    page: 1,
    year: null,
    week: null,
    status: null,
    companyId: null,
    filterBadgeValue: null,
  },
};

export const createWeeklyPlanSlice: StateCreator<
  IWeeklyPlanValue & IWeeklyPlanAction
> = (set) => {
  const sliceName = 'weeklyPlanSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setWeeklyPlanState: (payload) =>
      set((state) => ({
        weeklyPlanState: {
          ...state.weeklyPlanState,
          ...payload,
        },
      })),
    resetWeeklyPlanState: () => {
      set(initialState);
    },
  };
};
