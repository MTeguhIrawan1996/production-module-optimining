import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IActivityPlanState = {
  page: number;
  search: string;
};

export type IActivityPlanSliceValue = {
  activityPlanState: IActivityPlanState;
};

export interface IActivityPlanSliceAction {
  setActivityPlanPage: (payload: Pick<IActivityPlanState, 'page'>) => void;
  setSearchActivityPlan: (payload: Pick<IActivityPlanState, 'search'>) => void;
  resetActivityPlanState: () => void;
}

const initialState: IActivityPlanSliceValue = {
  activityPlanState: {
    page: 1,
    search: '',
  },
};

export const createActivityPlanSlice: StateCreator<
  IActivityPlanSliceValue & IActivityPlanSliceAction
> = (set) => {
  sliceResetFns.add(() => set(initialState));
  return {
    ...initialState,
    setSearchActivityPlan: (payload) =>
      set((state) => ({
        activityPlanState: {
          ...state.activityPlanState,
          search: payload.search,
        },
      })),
    setActivityPlanPage: (payload) =>
      set((state) => ({
        activityPlanState: {
          ...state.activityPlanState,
          page: payload.page,
        },
      })),
    resetActivityPlanState: () => {
      set(initialState);
    },
  };
};
