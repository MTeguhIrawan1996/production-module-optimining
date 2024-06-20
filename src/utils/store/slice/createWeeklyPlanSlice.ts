import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IWeeklyPlanState = {
  page: number;
  year: number | null;
  week: number | null;
  status: string | null;
  companyId: string | null;
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
  },
};

export const createWeeklyPlanSlice: StateCreator<
  IWeeklyPlanValue & IWeeklyPlanAction
> = (set) => {
  sliceResetFns.add(() => set(initialState));
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
